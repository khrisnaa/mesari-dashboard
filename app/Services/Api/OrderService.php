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

            foreach ($items as $item) {
                $variant = $variants[$item->product_variant_id];

                if ($variant->stock < $item->quantity) {
                    throw new Exception('Stock not enough.');
                }

                $variant->decrement('stock', $item->quantity);

                // 🔥 PERBAIKAN 1: Gunakan $item->price yang dipassing dari fungsi sebelumnya
                $lineSubtotal = $item->price * $item->quantity;
                $totalItemPrice += $lineSubtotal;

                $productWeight = $variant->product->weight ?? 0;
                $totalWeight += $productWeight * $item->quantity;
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

            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'order_status' => OrderStatus::PENDING->value,
                'payment_status' => PaymentStatus::PENDING->value,
                'subtotal' => $totalItemPrice, // Sekarang akan menyimpan total base + custom
                'shipping_cost' => $shippingPrice,
                'discount_amount' => 0,
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

            foreach ($items as $item) {
                $variant = $variants[$item->product_variant_id];

                OrderItem::create([
                    'order_id' => $order->id,
                    'customization_id' => $item->customization_id ?? null,
                    'product_variant_id' => $variant->id,

                    // 🔥 PERBAIKAN 2: Gunakan label "Custom Design" jika dikirim
                    'product_name' => $item->product_name ?? $variant->product->name,
                    'variant_name' => $item->variant_name ?? $variant->attributes->pluck('name')->implode(' / '),

                    // 🔥 PERBAIKAN 3: Simpan harga gabungan ke database
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal, // Bisa juga pakai: $item->price * $item->quantity
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

        $origin = config('rajaongkir.origin');

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
                'courier' => $courierCode,
                'price' => 'lowest',
            ]);

        if (! $response->successful()) {
            throw new \Exception('Failed to calculate shipping cost.');
        }

        $data = $response->json();

        if (! isset($data['data']) || empty($data['data'])) {
            throw new \Exception('Shipping services not found.');
        }

        $services = collect($data['data']);

        $selected = $services->first(function ($service) use ($courierCode, $courierService) {
            return $service['code'] === $courierCode
                && $service['service'] === $courierService;
        });

        if (! $selected) {
            throw new \Exception('Selected courier service not available.');
        }

        return [
            'cost' => (int) $selected['cost'],
            'etd' => $selected['etd'] ?? null,
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
        // 1. Ambil data kustomisasi yang valid (milik user dan masih draft)
        $customization = Customization::where('user_id', $user->id)
            ->where('id', $data['customization_id'])
            ->where('is_draft', true)
            ->firstOrFail();

        // 2. Ambil data varian baju dasarnya
        // 🔥 Perbaikan: Gunakan product_variant_id sesuai nama kolom di DB
        $variant = ProductVariant::with(['product', 'attributes'])->findOrFail($customization->product_variant_id);

        // 3. Kalkulasi Harga per Item: (Harga Baju + Total Harga Sablon 1 Pcs)
        $pricePerItem = $variant->price + $customization->additional_price;

        // 4. Siapkan item untuk di-passing ke processOrder
        $items = collect([
            (object) [
                'product_id' => $variant->product_id,
                'product_variant_id' => $variant->id,
                'customization_id' => $customization->id, // Kirim ID custom untuk disimpan ke order_items
                'price' => $pricePerItem, // Harga satuan yang sudah digabung
                'quantity' => $data['quantity'],
                'subtotal' => $pricePerItem * $data['quantity'], // Subtotal = (Base + Custom) * Qty
                'product_name' => $variant->product->name.' (Custom Design)',
                'variant_name' => $variant->attributes->pluck('name')->implode(' / '),
            ],
        ]);

        return DB::transaction(function () use ($user, $data, $items, $customization) {
            // Panggil shared logic untuk membuat Order & OrderItems
            $order = $this->processOrder($user, $data, $items, false);

            // Ubah status kustomisasi menjadi fix (bukan draft lagi) agar tidak bisa di-checkout ulang
            $customization->update(['is_draft' => false]);

            return $order;
        });
    }
}
