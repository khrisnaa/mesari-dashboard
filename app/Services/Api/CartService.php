<?php

namespace App\Services\Api;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;

class CartService
{
    // find or create cart
    public function getCart($userId)
    {
        return Cart::firstOrCreate([
            'user_id' => $userId,
        ]);
    }

    // add item to cart
    public function addItem(Cart $cart, array $data)
    {
        $variant = ProductVariant::findOrFail($data['product_variant_id']);

        $existing = CartItem::where('cart_id', $cart->id)->where('product_variant_id', $data['product_variant_id'])->first();

        if ($existing) {
            $existing->quantity += $data['quantity'];
            $existing->subtotal = $existing->quantity * $existing->price;
            $existing->save();

            return $existing;
        }

        return CartItem::create([
            'cart_id' => $cart->id,
            'product_variant_id' => $data['product_variant_id'],
            'price' => $variant->price,
            'quantity' => $data['quantity'],
            'subtotal' => $variant->price * $data['quantity'],
        ]);
    }

    // update cart item
    public function updateItem(CartItem $item, int $quantity)
    {
        $item->quantity = $quantity;
        $item->subtotal = $quantity * $item->price;
        $item->save();

        return $item;
    }

    // delete cart item
    public function deleteItem(CartItem $item)
    {
        return $item->delete();
    }
}
