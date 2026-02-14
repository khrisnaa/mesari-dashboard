<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{

    public function definition(): array
    {
        $totalItem = $this->faker->numberBetween(100000, 500000);
        $shipping = $this->faker->numberBetween(10000, 40000);
        $insurance = 0;
        $discount = 0;

        $grandTotal = $totalItem + $shipping + $insurance - $discount;

        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),

            'order_number' => 'ORD-' . now()->format('Ymd') . '-' . $this->faker->unique()->numberBetween(100, 999),

            // status
            'order_status' => OrderStatus::PENDING->value,
            'payment_status' => PaymentStatus::PENDING->value,

            // pricing
            'subtotal' => $totalItem,
            'shipping_cost' => $shipping,
            'discount_amount' => $discount,
            'grand_total' => $grandTotal,

            // shipping snapshot
            'shipping_courier_code' => $this->faker->randomElement(['jne', 'tiki', 'pos']),
            'shipping_courier_service' => $this->faker->randomElement(['REG', 'ECO', 'YES']),
            'shipping_estimation' => $this->faker->randomElement(['2-3 days', '3-5 days', '1 day']),
            'shipping_tracking_number' => null,
            'shipping_weight' => $this->faker->numberBetween(500, 3000),

            // address snapshot 
            'recipient_name' => $this->faker->name(),
            'recipient_phone' => $this->faker->phoneNumber(),
            'recipient_address_line' => $this->faker->streetAddress(),

            'recipient_province' => 'DKI JAKARTA',
            'recipient_city' => 'JAKARTA PUSAT',
            'recipient_district' => 'GAMBIR',
            'recipient_subdistrict' => 'KEBON KELAPA',
            'postal_code' => '10120',

            'note' => null,
        ];
    }
}
