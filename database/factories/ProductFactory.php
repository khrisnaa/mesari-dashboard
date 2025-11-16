<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = $this->faker->words(3, true);
        return [
            'name'        => $name,
            'slug'        => Str::slug($name),
            'description' => $this->faker->paragraph,
            'price'       => $this->faker->randomFloat(2, 10, 1000),
            'size'        => $this->faker->randomElement(['S', 'M', 'L', 'XL', 'XXL']),
            'color'       => $this->faker->safeColorName(),
            'stock'       => $this->faker->numberBetween(0, 100),
        ];
    }
}
