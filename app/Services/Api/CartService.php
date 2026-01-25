<?php

namespace App\Services\Api;

use App\Models\Cart;
use App\Models\CartItem;

class CartService
{
    public function getCart($userId)
    {
        return Cart::firstOrCreate([
            'user_id' => $userId
        ]);
    }

    public function addItem(Cart $cart, array $data)
    {
        $existing = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $data['product_id'])
            ->where('product_variant_id', $data['product_variant_id'])
            ->first();

        if ($existing) {
            $existing->quantity += $data['quantity'];
            $existing->subtotal = $existing->quantity * $existing->price;
            $existing->save();

            return $existing;
        }

        return CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $data['product_id'],
            'product_variant_id' => $data['product_variant_id'],
            'price' => $data['price'],
            'quantity' => $data['quantity'],
            'subtotal' => $data['price'] * $data['quantity'],
        ]);
    }

    public function updateItem(CartItem $item, int $quantity)
    {
        $item->quantity = $quantity;
        $item->subtotal = $quantity * $item->price;
        $item->save();

        return $item;
    }

    public function deleteItem(CartItem $item)
    {
        return $item->delete();
    }
}
