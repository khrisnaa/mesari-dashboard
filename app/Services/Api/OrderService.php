<?php

namespace App\Services\Api;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Exception;

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
                ->with('product.images', 'attributes')
                ->get()
                ->keyBy('id');

            foreach ($items as $item) {
                $variant = $variants[$item->product_variant_id];

                if ($variant->stock < $item->quantity) {
                    throw new Exception("Stock not enough.");
                }

                $variant->decrement('stock', $item->quantity);
            }

            $subtotal = $items->sum('subtotal');
            $total = $subtotal + $data['shipping_cost'];

            $address = $user->addresses()->findOrFail($data['address_id']);

            $order = Order::create([
                'user_id' => $user->id,
                'order_status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'],
                'subtotal' => $subtotal,
                'total' => $total,

                // snapshot address
                'recipient_name' => $address->recipient_name,
                'recipient_phone' => $address->phone,
                'recipient_address' => $address->address_line,
                'province_name' => $address->province_name,
                'city_name' => $address->city_name,
                'postal_code' => $address->postal_code,

                'shipping_courier' => $data['shipping_courier'],
                'shipping_service' => $data['shipping_service'],
                'shipping_cost' => $data['shipping_cost'],
                'shipping_weight' => $data['shipping_weight'],
                'shipping_estimation' => $data['shipping_estimation'] ?? null,
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
}
