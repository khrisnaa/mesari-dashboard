<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('email', ['member@example.com', 'guest@example.com'])->get();

        $carts = collect();

        foreach ($users as $user) {
            $cart = Cart::factory()->create([
                'user_id' => $user->id,
            ]);

            $carts->push($cart);
        }

        $variants = ProductVariant::where('stock', '>', 5)->get();

        foreach ($carts as $cart) {
            $selectedVariants = $variants->random(rand(1, 3));

            foreach ($selectedVariants as $variant) {
                $quantity = rand(1, 5);
                CartItem::factory()->create([
                    'cart_id' => $cart->id,
                    'product_variant_id' => $variant->id,
                    'price' => $variant->price,
                    'quantity' => $quantity,
                    'subtotal' => $variant->price * $quantity,
                ]);
            }
        }
    }
}
