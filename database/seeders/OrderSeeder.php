<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
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

        foreach ($users as $user) {
            for ($o = 1; $o <= 4; $o++) {

                $orderId = Str::uuid();
                $shippingPrice = rand(10000, 30000);

                $totalItemPrice = 0;
                $totalWeight = 0;
                $weight = 500;

                DB::table('orders')->insert([
                    'id'                      => $orderId,
                    'user_id'                 => $user->id,
                    'order_number'            => 'ORD-' . now()->format('Ymd') . '-' . rand(100, 999),

                    // status
                    'order_status'            => OrderStatus::PENDING->value,
                    'payment_status'          => PaymentStatus::PENDING->value,

                    // Pricing 
                    'subtotal'        => 0,
                    'shipping_cost'          => $shippingPrice,
                    'discount_amount'         => 0,
                    'grand_total'             => 0,

                    // shipping snapshot
                    'shipping_courier_code'   => 'jne',
                    'shipping_courier_service' => 'REG',
                    'shipping_estimation'     => '2-3 days',
                    'shipping_tracking_number' => null,
                    'shipping_weight'   => 0,

                    // address snapshot
                    'recipient_name'          => $user->name,
                    'recipient_phone'         => '081234567890',
                    'recipient_address_line'  => 'Jl. Contoh No. 123',

                    'recipient_province'      => 'DKI JAKARTA',
                    'recipient_city'          => 'JAKARTA SELATAN',
                    'recipient_district'      => 'KEBAYORAN BARU',
                    'recipient_subdistrict'   => 'GUNUNG',
                    'postal_code'             => '12120',

                    'note'                    => null,

                    'created_at'              => now(),
                    'updated_at'              => now(),
                ]);

                // insert items
                $itemsCount = rand(2, 3);
                $selectedVariants = $variants->random($itemsCount);

                foreach ($selectedVariants as $variant) {
                    $qty = rand(1, 3);
                    $lineSubtotal = $variant->price * $qty;

                    $totalItemPrice += $lineSubtotal;

                    // variant weight
                    $totalWeight += ($weight * $qty);

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

                $grandTotal = $totalItemPrice + $shippingPrice;

                // update total final
                DB::table('orders')->where('id', $orderId)->update([
                    'subtotal'      => $totalItemPrice,
                    'shipping_weight' => $totalWeight,
                    'grand_total'           => $grandTotal,
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
