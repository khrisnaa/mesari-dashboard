<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartSeeder extends Seeder
{

    public function run(): void
    {
        $users = User::whereIn('email', [
            'member@example.com',
            'guest@example.com'
        ])->get();

        if ($users->isEmpty()) return;

        $variants = ProductVariant::take(5)->get();
        if ($variants->isEmpty()) return;

        foreach ($users as $user) {
            for ($i = 1; $i <= 2; $i++) {
                $cartId = Str::uuid();

                DB::table('carts')->insert([
                    'id'         => $cartId,
                    'user_id'    => $user->id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);

                foreach ($variants->take(2) as $variant) {
                    $qty = rand(1, 3);
                    $subtotal = $variant->price * $qty;

                    DB::table('cart_items')->insert([
                        'id'                 => Str::uuid(),
                        'cart_id'            => $cartId,
                        'product_variant_id' => $variant->id,
                        'price'              => $variant->price,
                        'quantity'           => $qty,
                        'subtotal'           => $subtotal,
                        'created_at'         => now(),
                        'updated_at'         => now()
                    ]);
                }
            }
        }
    }

    public function test(): void
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
