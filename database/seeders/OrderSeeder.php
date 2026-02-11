<?php

namespace Database\Seeders;

use App\Enums\VariantAttributeType;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereIn('email', [
            'member@example.com',
            'guest@example.com'
        ])->get();

        if ($users->isEmpty()) {
            return;
        }

        $variants = ProductVariant::with(['product', 'attributes'])
            ->get()
            ->filter(fn($variant) => $variant->product && $variant->attributes->isNotEmpty());

        if ($variants->isEmpty()) {
            return;
        }

        $orderStatuses = ['pending', 'paid', 'packed', 'shipped', 'completed', 'cancelled'];
        $paymentStatuses = ['pending', 'paid', 'failed'];

        foreach ($users as $user) {
            for ($o = 1; $o <= 4; $o++) {

                $orderId = Str::uuid();
                $shippingCost = rand(10000, 30000);

                DB::table('orders')->insert([
                    'id'                 => $orderId,
                    'user_id'            => $user->id,
                    'order_status'       => $orderStatuses[array_rand($orderStatuses)],
                    'payment_status'     => $paymentStatuses[array_rand($paymentStatuses)],
                    'payment_method'     => 'manual_transfer',
                    'subtotal'           => 0,
                    'total'              => 0,
                    'recipient_name'     => $user->name,
                    'recipient_phone'    => '081234567890',
                    'recipient_address'  => 'Jl. Contoh No. 123',
                    'province_name'      => 'DKI Jakarta',
                    'city_name'          => 'Jakarta Selatan',
                    'postal_code'        => '12120',
                    'shipping_courier'   => 'jne',
                    'shipping_service'   => 'REG',
                    'shipping_cost'      => $shippingCost,
                    'shipping_weight'    => rand(200, 800),
                    'shipping_estimation' => '2-3 days',
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ]);

                $subtotal = 0;
                $itemsCount = rand(2, 3);
                $selectedVariants = $variants->random($itemsCount);

                foreach ($selectedVariants as $variant) {
                    $qty = rand(1, 3);
                    $lineSubtotal = $variant->price * $qty;
                    $subtotal += $lineSubtotal;

                    DB::table('order_items')->insert([
                        'id'                 => Str::uuid(),
                        'order_id'           => $orderId,
                        'customization_id'   => null,
                        'product_variant_id' => $variant->id,
                        'product_name'       => $variant->product->name,
                        'variant_name'       => $variant->attributes->pluck('name')->join(', '),
                        'price'              => $variant->price,
                        'quantity'           => $qty,
                        'subtotal'           => $lineSubtotal,
                        'created_at'         => now(),
                        'updated_at'         => now(),
                    ]);
                }

                DB::table('orders')->where('id', $orderId)->update([
                    'subtotal' => $subtotal,
                    'total'    => $subtotal + $shippingCost
                ]);
            }
        }
    }

    public function test(): void
    {
        $users = User::whereIn('email', ['member@example.com', 'guest@example.com'])->get();

        $variants = ProductVariant::with(['product', 'attributes'])
            ->where('stock', '>', 5)
            ->get();

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
                                    VariantAttributeType::SIZE->value => 1,
                                    VariantAttributeType::COLOR->value => 2,
                                    default => 99,
                                };
                            })
                            ->pluck('name')
                            ->implode(' / ');

                        OrderItem::factory()->create([
                            'order_id' => $order->id,
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
