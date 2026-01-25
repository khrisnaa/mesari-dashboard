<?php

namespace App\Services\Api;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderAddress;
use App\Models\OrderItem;
use App\Models\ProductVariant;

class OrderService
{
    // checkout from cart
    public function checkout($user, array $data)
    {
        // get user cart
        $cart = Cart::where('user_id', $user->id)->with('items')->firstOrFail();

        if ($cart->items->count() === 0) {
            throw new \Exception("Cart is empty.");
        }

        return $this->processOrder($user, $data, $cart->items);
    }

    // buy now checkout (no cart deletion)
    public function directCheckout($user, array $data)
    {
        // get variant
        $variant = ProductVariant::with('product')->findOrFail($data['product_variant_id']);

        // fake cart item array structure
        $items = collect([
            (object)[
                'product_id'         => $variant->product_id,
                'product_variant_id' => $variant->id,
                'product_name'       => $variant->product->name,
                'variant_name'       => $variant->name,
                'price'              => $variant->price,
                'quantity'           => $data['quantity'],
                'subtotal'           => $variant->price * $data['quantity'],
            ]
        ]);

        return $this->processOrder($user, $data, $items);
    }

    // shared order creation logic
    private function processOrder($user, array $data, $items)
    {
        $subtotal = $items->sum('subtotal');
        $total = $subtotal + $data['shipping_cost'];

        // create order
        $order = Order::create([
            'user_id'          => $user->id,
            'status'           => 'pending',
            'subtotal'         => $subtotal,
            'total'            => $total,
            'payment_method'   => $data['payment_method'],
            'payment_status'   => 'pending',
            'shipping_courier' => $data['shipping_courier'],
            'shipping_service' => $data['shipping_service'],
            'shipping_cost'    => $data['shipping_cost'],
            'shipping_weight'  => $data['shipping_weight'],
            'shipping_etd'     => $data['shipping_etd'],
        ]);

        // get address
        $addr = $user->addresses()->findOrFail($data['address_id']);

        // create order address
        OrderAddress::create([
            'order_id'         => $order->id,
            'recipient_name'   => $addr->recipient_name,
            'phone'            => $addr->phone,
            'address_line'     => $addr->address_line,
            'province_name'    => $addr->province_name,
            'city_name'        => $addr->city_name,
            'subdistrict_name' => $addr->subdistrict_name,
            'postal_code'      => $addr->postal_code,
        ]);

        // create order items
        foreach ($items as $item) {
            OrderItem::create([
                'order_id'          => $order->id,
                'product_id'        => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'product_name'      => $item->product_name,
                'variant_name'      => $item->variant_name,
                'price'             => $item->price,
                'quantity'          => $item->quantity,
                'subtotal'          => $item->subtotal,
            ]);
        }

        return $order;
    }
}
