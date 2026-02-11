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
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id'            => null,
            'order_status'       => $this->faker->randomElement(array_column(OrderStatus::cases(), 'value')),
            'payment_status'     => $this->faker->randomElement(array_column(PaymentStatus::cases(), 'value')),
            'payment_method'     => $this->faker->randomElement(['bank_transfer', 'credit_card', 'ewallet']),

            'subtotal'           => $this->faker->randomFloat(2, 10000, 500000),
            'total'              => $this->faker->randomFloat(2, 10000, 500000),

            'recipient_name'     => $this->faker->name(),
            'recipient_phone'    => $this->faker->phoneNumber(),
            'recipient_address'  => $this->faker->streetAddress(),
            'province_name'      => $this->faker->state(),
            'city_name'          => $this->faker->city(),
            'postal_code'        => $this->faker->postcode(),

            'shipping_courier'   => $this->faker->randomElement(['jne', 'tiki', 'pos']),
            'shipping_service'   => $this->faker->randomElement(['REG', 'ECO', 'YES']),
            'shipping_cost'      => $this->faker->numberBetween(10000, 40000),
            'shipping_weight'    => $this->faker->randomFloat(2, 0.1, 5),
            'shipping_estimation' => $this->faker->randomElement(['2-3 days', '3-5 days', 'Next Day']),
        ];
    }
}
