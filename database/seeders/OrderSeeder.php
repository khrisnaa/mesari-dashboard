<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/orders.json');

        if (! File::exists($path)) {
            dd('orders.json not found.');
        }

        $data = json_decode(File::get($path), true);

        foreach ($data as $entry) {

            $user = \App\Models\User::where('email', $entry['user_email'])->first();
            if (! $user) {
                continue;
            }

            foreach ($entry['orders'] as $orderData) {

                $order = Order::create([
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'order_number' => 'ORD-'.now()->format('YmdHisv').'-'.Str::random(4),
                    'order_status' => OrderStatus::PENDING,
                    'payment_status' => PaymentStatus::PENDING,
                    'subtotal' => 0,
                    'shipping_cost' => rand(8000, 20000),
                    'discount_amount' => 0,
                    'grand_total' => 0,
                    'shipping_weight' => 0,
                    'shipping_courier_code' => 'jne',
                    'shipping_courier_service' => 'REG',
                    'shipping_estimation' => '2-3 days',
                    'recipient_name' => $user->name,
                    'recipient_phone' => '081234567890',
                    'recipient_address_line' => 'Jl. Contoh No. 123',
                    'recipient_province' => 'DKI JAKARTA',
                    'recipient_city' => 'JAKARTA SELATAN',
                    'recipient_district' => 'KEBAYORAN BARU',
                    'recipient_subdistrict' => 'GUNUNG',
                    'postal_code' => '12120',
                ]);

                $subtotal = 0;
                $weightTotal = 0;

                foreach ($orderData['products'] as $p) {

                    $product = Product::where('slug', $p['slug'])->first();
                    if (! $product) {
                        continue;
                    }

                    $variant = $product->variants()->inRandomOrder()->first();
                    if (! $variant) {
                        continue;
                    }

                    $qty = $p['quantity'];
                    $lineTotal = $variant->price * $qty;

                    $subtotal += $lineTotal;
                    $weightTotal += 200 * $qty;

                    OrderItem::create([
                        'id' => Str::uuid(),
                        'order_id' => $order->id,
                        'product_variant_id' => $variant->id,
                        'product_name' => $variant->product->name,
                        'variant_name' => $variant->attributes->pluck('name')->join(', '),
                        'price' => $variant->price,
                        'quantity' => $qty,
                        'subtotal' => $lineTotal,
                    ]);
                }

                $order->update([
                    'subtotal' => $subtotal,
                    'shipping_weight' => $weightTotal,
                    'grand_total' => $subtotal + $order->shipping_cost,
                ]);
            }
        }
    }
}
