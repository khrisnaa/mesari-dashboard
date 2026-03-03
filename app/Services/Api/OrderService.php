<?php

namespace App\Services\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\Customization;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderService
{
    // process checkout from cart
    public function checkout($user, array $data)
    {
        $cart = Cart::where('user_id', $user->id)
            ->with(['items.variant.product', 'items.variant.attributes', 'items.variant'])
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            throw new Exception('Cart is empty.');
        }

        return $this->processOrder($user, $data, $cart->items, true);
    }

    // process checkout from direct buy now (without adding into cart)
    public function directCheckout($user, array $data)
    {
        $variant = ProductVariant::with(['product', 'attributes'])->findOrFail($data['product_variant_id']);

        $items = collect([
            (object) [
                'product_id' => $variant->product_id,
                'product_variant_id' => $variant->id,
                'price' => $variant->price,
                'quantity' => $data['quantity'],
                'subtotal' => $variant->price * $data['quantity'],
                'product_name' => $variant->product->name,
                'variant_name' => $variant->attributes->pluck('name')->implode(' / '),
            ],
        ]);

        return $this->processOrder($user, $data, $items, false);
    }

    // shared order logic
    private function processOrder($user, array $data, $items, bool $fromCart)
    {
        return DB::transaction(function () use ($user, $data, $items, $fromCart) {

            $variantIds = $items->pluck('product_variant_id');

            $variants = ProductVariant::whereIn('id', $variantIds)
                ->lockForUpdate()
                ->with(['product', 'product.images', 'attributes'])
                ->get()
                ->keyBy('id');

            $totalItemPrice = 0;
            $totalWeight = 0;
            $totalDiscountAmount = 0; // Tambahan: untuk merekam total diskon

            $processedItems = []; // Menyimpan kalkulasi harga agar tidak diulang di loop kedua

            // LOOPING 1: Pengecekan stok, perhitungan harga final & berat
            foreach ($items as $item) {
                $variant = $variants[$item->product_variant_id];
                $product = $variant->product;

                if ($variant->stock < $item->quantity) {
                    throw new Exception('Stock not enough for '.$product->name);
                }

                $variant->decrement('stock', $item->quantity);

                // 1. Validasi Diskon Langsung dari Database (Real-time)
                $now = now();
                $discountValue = (float) $product->discount_value;
                $discountType = $product->discount_type;

                $isDiscountActive = $discountValue > 0 &&
                    ($product->discount_start_at === null || $now->greaterThanOrEqualTo($product->discount_start_at)) &&
                    ($product->discount_end_at === null || $now->lessThanOrEqualTo($product->discount_end_at));

                $originalPrice = (float) $variant->price;
                $finalUnitPrice = $originalPrice;

                if ($isDiscountActive) {
                    if ($discountType === 'percentage') {
                        $finalUnitPrice = $originalPrice - ($originalPrice * ($discountValue / 100));
                    } elseif ($discountType === 'fixed') {
                        $finalUnitPrice = max(0, $originalPrice - $discountValue);
                    }
                }

                // 2. Kalkulasi Subtotal & Diskon
                $lineSubtotal = $finalUnitPrice * $item->quantity;
                $totalItemPrice += $lineSubtotal;

                // Opsional: Hitung berapa rupiah yang dihemat pembeli
                $discountSaved = ($originalPrice - $finalUnitPrice) * $item->quantity;
                $totalDiscountAmount += $discountSaved;

                $productWeight = $product->weight ?? 0;
                $totalWeight += $productWeight * $item->quantity;

                // 3. Simpan data yang sudah dihitung untuk di-insert ke OrderItem nanti
                $processedItems[] = [
                    'item' => $item,
                    'variant' => $variant,
                    'final_price' => $finalUnitPrice,
                    'subtotal' => $lineSubtotal,
                ];
            }

            $address = $user->addresses()->findOrFail($data['address_id']);

            // shipping API & filter service
            $shipping = $this->calculateShipping(
                $totalWeight,
                $address->ro_subdistrict_id,
                $data['shipping_courier_code'],
                $data['shipping_courier_service']
            );

            $shippingPrice = $shipping['cost'];
            $shippingEstimation = $shipping['etd'];

            $grandTotal = $totalItemPrice + $shippingPrice;

            // BUAT ORDER
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'order_status' => OrderStatus::PENDING->value,
                'payment_status' => PaymentStatus::PENDING->value,

                // Subtotal sekarang adalah total harga BARANG yang sudah dipotong diskon
                'subtotal' => $totalItemPrice,
                'shipping_cost' => $shippingPrice,
                // Rekam berapa diskon yang didapat (berguna untuk laporan & resi)
                'discount_amount' => $totalDiscountAmount,
                'grand_total' => $grandTotal,

                'shipping_courier_code' => $data['shipping_courier_code'],
                'shipping_courier_service' => $data['shipping_courier_service'],
                'shipping_estimation' => $shippingEstimation,
                'shipping_tracking_number' => null,

                'shipping_weight' => $totalWeight,

                // snapshot address
                'recipient_name' => $address->recipient_name,
                'recipient_phone' => $address->phone,
                'recipient_address_line' => $address->address_line,
                'recipient_province' => $address->province_name,
                'recipient_city' => $address->city_name,
                'recipient_district' => $address->district_name,
                'recipient_subdistrict' => $address->subdistrict_name,
                'postal_code' => $address->postal_code,

                'note' => $data['note'] ?? null,
            ]);

            // LOOPING 2: Buat Order Item menggunakan harga yang sudah valid
            foreach ($processedItems as $processed) {
                $item = $processed['item'];
                $variant = $processed['variant'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'customization_id' => $item->customization_id ?? null,
                    'product_variant_id' => $variant->id,

                    'product_name' => $item->product_name ?? $variant->product->name,
                    'variant_name' => $item->variant_name ?? $variant->attributes->pluck('name')->implode(' / '),

                    // Gunakan harga dan subtotal hasil kalkulasi backend, BUKAN dari frontend
                    'price' => $processed['final_price'],
                    'quantity' => $item->quantity,
                    'subtotal' => $processed['subtotal'],
                ]);
            }

            if ($fromCart && $user->cart) {
                $user->cart->items()->delete();
            }

            return $order->load([
                'items',
                'items.variant.product.images',
            ]);
        });
    }

    private function calculateShipping(
        int $weight,
        int $destination,
        string $courierCode,
        string $courierService
    ): array {

        if ($courierCode === 'flat') {
            return $this->calculateFlatShipping($weight, $courierService);
        }

        $origin = config('rajaongkir.origin');

        // Memastikan berat minimal 1 gram
        $validWeight = $weight > 0 ? $weight : 1000;

        // 1. SIAPKAN PAYLOAD
        $payload = [
            'origin' => $origin,
            'destination' => $destination,
            'weight' => $validWeight,
            'courier' => $courierCode,
            // 'originType' => 'city',         // Buka jika pakai akun PRO
            // 'destinationType' => 'subdistrict', // Buka jika pakai akun PRO
        ];

        // 2. LOG DATA REQUEST (Sebelum dikirim ke API)
        Log::info('--- RAJAONGKIR REQUEST ---');
        Log::info('URL Endpoint: '.config('rajaongkir.cost_api_url'));
        Log::info('Payload Data:', $payload);
        Log::info('Target Service: '.$courierService);

        // Eksekusi API
        $response = Http::asForm()
            ->timeout(10)
            ->withHeaders([
                'key' => config('rajaongkir.api_key'),
                'Accept' => 'application/json',
            ])
            ->post(config('rajaongkir.cost_api_url'), $payload);

        // 3. LOG DATA RESPONSE (Hasil dari API)
        $responseBody = $response->json();

        Log::info('--- RAJAONGKIR RESPONSE ---');
        Log::info('Status HTTP: '.$response->status());
        Log::info('Body Response:', $responseBody ?? ['raw' => $response->body()]);

        // Cek jika HTTP status bukan 200 OK
        if (! $response->successful()) {
            $errorMessage = $responseBody['rajaongkir']['status']['description'] ?? 'Unknown API Error';
            Log::error('RajaOngkir API Failed: '.$errorMessage);
            throw new \Exception('Gagal menghitung ongkir: '.$errorMessage);
        }

        // Pastikan struktur data sesuai dengan kembalian RajaOngkir
        if (! isset($responseBody['rajaongkir']['results'][0]['costs']) || empty($responseBody['rajaongkir']['results'][0]['costs'])) {
            Log::warning('RajaOngkir: Kurir tidak mendukung rute ini atau data kosong.');
            throw new \Exception('Layanan pengiriman tidak ditemukan untuk rute ini.');
        }

        $services = collect($responseBody['rajaongkir']['results'][0]['costs']);

        // Cari service yang cocok (abaikan huruf besar/kecil agar lebih aman)
        $selected = $services->first(function ($service) use ($courierService) {
            return strtoupper($service['service']) === strtoupper($courierService);
        });

        if (! $selected) {
            $availableServices = $services->pluck('service')->implode(', ');
            Log::warning("RajaOngkir: Service '{$courierService}' tidak ditemukan. Tersedia: {$availableServices}");
            throw new \Exception("Layanan '{$courierService}' tidak tersedia. Pilih layanan lain.");
        }

        Log::info('Ongkir Berhasil Dihitung: Rp'.$selected['cost'][0]['value']);

        return [
            'cost' => (int) $selected['cost'][0]['value'],
            'etd' => $selected['cost'][0]['etd'] ?? null,
        ];
    }

    private function calculateFlatShipping(int $weight, string $courierService): array
    {

        $weightInKg = ceil($weight / 1000);
        $costPerKg = 0;
        $etd = '';

        if ($courierService === 'EXP') {
            $costPerKg = 25000;
            $etd = '1-2 days';
        } else {

            $costPerKg = 15000;
            $etd = '3-5 days';
        }

        return [
            'cost' => (int) ($costPerKg * $weightInKg),
            'etd' => $etd,
        ];
    }

    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');

        $random = strtoupper(Str::random(4));

        return sprintf('ORD-%s-%s', $date, $random);
    }

    // get order list
    public function getOrderHistory($user, int $perPage = 10)
    {
        return Order::where('user_id', $user->id)
            ->with([
                'items.variant.product.images',
                'items.review',
            ])
            ->latest()
            ->paginate($perPage);
    }

    // get order detail
    public function getOrderDetail($user, $orderId)
    {
        return Order::where('user_id', $user->id)
            ->with([
                'items.variant.product.images',
            ])
            ->findOrFail($orderId);
    }

    public function previewShipping(
        int $weight,
        int $destination,
    ) {

        $origin = config('rajaongkir.origin');
        $courier = config('rajaongkir.courier');

        $response = Http::asForm()
            ->timeout(10)
            ->withHeaders([
                'key' => config('rajaongkir.api_key'),
                'Accept' => 'application/json',
            ])
            ->post(config('rajaongkir.cost_api_url'), [
                'origin' => $origin,
                'destination' => $destination,
                'weight' => $weight,
                'courier' => $courier,
                'price' => 'lowest',
            ]);

        if (! $response->successful()) {
            Log::error('RajaOngkir cost API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            throw new \Exception('Failed to fetch shipping cost.');
        }

        if (! $response->successful()) {
            throw new \Exception('Failed to fetch shipping cost.');
        }

        $data = $response->json();

        return collect($data['data'])->map(function ($service) {
            return [
                'name' => $service['name'],
                'code' => $service['code'],
                'service' => $service['service'],
                'description' => $service['description'],
                'cost' => (int) $service['cost'],
                'etd' => $service['etd'] ?? null,
            ];
        })->values()->toArray();
    }

    public function customizationCheckout($user, array $data)
    {

        $customization = Customization::where('user_id', $user->id)
            ->where('id', $data['customization_id'])
            ->where('is_draft', true)
            ->firstOrFail();

        $variant = ProductVariant::with(['product', 'attributes'])->findOrFail($customization->product_variant_id);

        $pricePerItem = $variant->price + $customization->additional_price;

        $items = collect([
            (object) [
                'product_id' => $variant->product_id,
                'product_variant_id' => $variant->id,
                'customization_id' => $customization->id,
                'price' => $pricePerItem,
                'quantity' => $data['quantity'],
                'subtotal' => $pricePerItem * $data['quantity'],
                'product_name' => $variant->product->name.' (Custom Design)',
                'variant_name' => $variant->attributes->pluck('name')->implode(' / '),
            ],
        ]);

        return DB::transaction(function () use ($user, $data, $items, $customization) {
            $order = $this->processOrder($user, $data, $items, false);
            $customization->update(['is_draft' => false]);

            return $order;
        });
    }
}
