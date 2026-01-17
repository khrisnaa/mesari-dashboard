<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Str::uuid(),
            'product_id' => Str::uuid(),
            'product_variant_id' => Str::uuid(),
            'product_name' => null,
            'variant_name' => null,
            'price' => 0,
            'quantity' => $this->faker->numberBetween(1, 5),
            'subtotal' => 0
        ];
    }
}
