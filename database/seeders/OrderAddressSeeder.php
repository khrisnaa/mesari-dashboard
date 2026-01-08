<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $orders = Order::with(['user.addresses'])->get();

        foreach ($orders as $order) {
            $address =  $order->user->addresses->random();

            OrderAddress::factory()->create([
                'order_id' => $order->id,
                'recipient_name' => $address->recipient_name,
                'phone' => $address->phone,
                'address_line' => $address->address_line,
                'province_name' => $address->province_name,
                'city_name' => $address->city_name,
                'subdistrict_name' => $address->subdistrict_name,
                'postal_code' => $address->postal_code
            ]);
        }
    }
}
