<?php

namespace App\Services\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Http;

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
                    throw new Exception("Stock not enough.");
                }

                $variant->decrement('stock', $item->quantity);

                $lineSubtotal = $variant->price * $item->quantity;
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

                'payment_method' => null,
                'payment_token' => null,
                'payment_url' => null,

                'subtotal' => $totalItemPrice,
                'shipping_price' => $shippingPrice,
                'insurance_price' => 0,
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
                    'product_variant_id' => $variant->id,
                    'product_name' => $variant->product->name,
                    'variant_name' => $variant->attributes->pluck('name')->implode(' / '),
                    'price' => $variant->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $variant->price * $item->quantity,
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
                'key' => config('rajaongkir.key'),
                'Accept' => 'application/json',
            ])
            ->post(config('rajaongkir.cost_api_url'), [
                'origin' => $origin,
                'destination' => $destination,
                'weight' => $weight,
                'courier' => $courierCode,
                'price' => 'lowest',
            ]);

        if (!$response->successful()) {
            throw new \Exception('Failed to calculate shipping cost.');
        }

        $data = $response->json();

        if (!isset($data['data']) || empty($data['data'])) {
            throw new \Exception('Shipping services not found.');
        }

        $services = collect($data['data']);

        $selected = $services->first(function ($service) use ($courierCode, $courierService) {
            return $service['code'] === $courierCode
                && $service['service'] === $courierService;
        });

        if (!$selected) {
            throw new \Exception('Selected courier service not available.');
        }

        return [
            'cost' => (int) $selected['cost'],
            'etd'  => $selected['etd'] ?? null,
        ];
    }

    private function generateOrderNumber(): string
    {
        $date = now()->format('Ymd');

        $lastOrder = Order::whereDate('created_at', now())
            ->orderByDesc('created_at')
            ->lockForUpdate()
            ->first();

        if ($lastOrder) {
            $lastNumber = (int) substr($lastOrder->order_number, -3);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('ORD-%s-%03d', $date, $nextNumber);
    }



    // get order list
    public function getOrderHistory($user, int $perPage = 10)
    {
        return Order::where('user_id', $user->id)
            ->with([
                'items.variant.product.images',
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
                'key' => config('rajaongkir.key'),
                'Accept' => 'application/json',
            ])
            ->post(config('rajaongkir.cost_api_url'), [
                'origin' => $origin,
                'destination' => $destination,
                'weight' => $weight,
                'courier' => $courier,
                'price' => 'lowest',
            ]);

        if (!$response->successful()) {
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
}
