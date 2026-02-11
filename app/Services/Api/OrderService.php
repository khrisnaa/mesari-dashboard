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
            // lock variants to avoid race condition
            $variantIds = $items->pluck('product_variant_id');

            $variants = ProductVariant::whereIn('id', $variantIds)->lockForUpdate()->get()->keyBy('id');

            // reduce stock

            foreach ($items as $item) {
                $variant = $variants[$item->product_variant_id];

                if ($variant->stock < $item->quantity) {
                    throw new Exception("Stock not enough for variant {$variant->id}");
                }
                $variant->stock -= $item->quantity;

                $variant->save();
            }

            // calculate totals
            $subtotal = $items->sum('subtotal');
            $total = $subtotal + $data['shipping_cost'];

            // create order
            $order = Order::create([
                'user_id' => $user->id,
                'order_status' => 'pending',
                'subtotal' => $subtotal,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'payment_status' => 'pending',
                'shipping_courier' => $data['shipping_courier'],
                'shipping_service' => $data['shipping_service'],
                'shipping_cost' => $data['shipping_cost'],
                'shipping_weight' => $data['shipping_weight'],
                'shipping_etd' => $data['shipping_etd'],
            ]);

            // create order address
            $address = $user->addresses()->findOrFail($data['address_id']);
            //nothing to do

            // create order items
            foreach ($items as $item) {
                $productName = $fromCart ? $item->variant->product->name : $item->product_name;

                $variantName = $fromCart ? $item->variant->attributes->pluck('name')->implode(' / ') : $item->variant_name;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name' => $productName,
                    'variant_name' => $variantName,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                ]);
            }

            // clear cart if from cart
            if ($fromCart && $user->cart) {
                $user->cart->items()->delete();
            }

            return $order;
        });
    }

    // get order list
    public function getOrderHistory($user)
    {
        return Order::where('user_id', $user->id)
            ->with(['address'])
            ->latest()
            ->paginate(10); // pagination 10
    }

    // get order detail
    public function getOrderDetail($user, $orderId)
    {
        return Order::where('user_id', $user->id)
            ->with(['address', 'items', 'items.product', 'items.variant'])
            ->findOrFail($orderId);
    }
}
