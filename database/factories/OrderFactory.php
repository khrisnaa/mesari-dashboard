<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

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
            'user_id' => null,
            'status' => $this->faker->randomElement(array_column(OrderStatus::cases(), 'value')),
            'subtotal' => 0,
            'total' => 0,
            'payment_method' => $this->faker->word(),
            'payment_status' => PaymentStatus::PENDING->value,
            'shipping_courier' => $this->faker->word(),
            'shipping_service' => $this->faker->word(),
            'shipping_cost' => $this->faker->numberBetween(15000, 30000),
            'shipping_weight' => $this->faker->randomFloat(2, 0, 2),
            'shipping_etd' => $this->faker->date('Y-m-d', '+1 week')
        ];
    }
}
