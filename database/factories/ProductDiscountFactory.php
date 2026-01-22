<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductDiscount>
 */
class ProductDiscountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $type = $this->faker->randomElement(array_column(DiscountType::cases(), 'value'));
        $start = $this->faker->dateTimeBetween('-3 days', '+2 days');
        $end   = (clone $start)->modify('+' . rand(1, 7) . ' days');

        return [
            'product_id' => null,
            'type' => $type,
            'value' => $type === DiscountType::FIXED
                ? $this->faker->numberBetween(10000, 20000)
                : $this->faker->numberBetween(5, 20),
            'start_at' => $start,
            'end_at' => $end,
        ];
    }
}
