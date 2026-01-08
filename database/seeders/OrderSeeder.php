<?php

namespace Database\Seeders;

use App\Enums\AttributeType;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereIn('email', ['member@example.com', 'guest@example.com'])->get();

        $variants = ProductVariant::with(['product', 'attributes'])->where('stock', '>', 5)->get();

        foreach ($users as $user) {
            Order::factory()
                ->count(3)
                ->create([
                    'user_id' => $user->id,
                ])
                ->each(function ($order) use ($variants) {
                    $selectedVariants = $variants->random(rand(1, 3));

                    foreach ($selectedVariants as $variant) {
                        $quantity = rand(1, 5);
                        $variantName = $variant->attributes
                            ->sortBy(function ($attr) {
                                return match ($attr->type) {
                                    AttributeType::SIZE->value => 1,
                                    AttributeType::COLOR->value => 2,
                                    default => 99,
                                };
                            })
                            ->pluck('name')
                            ->implode(' / ');


                        OrderItem::factory()->create([
                            'order_id' => $order->id,
                            'product_id' => $variant->product_id,
                            'product_variant_id' => $variant->id,
                            'product_name' => $variant->product->name,
                            'variant_name' => $variantName,
                            'price' => $variant->price,
                            'quantity' => $quantity,
                            'subtotal' => $variant->price * $quantity,
                        ]);
                    }
                });
        }
    }
}
