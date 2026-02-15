<?php

namespace Database\Factories;

use App\Enums\DiscountType;
use App\Enums\ProductStatus;
use App\Models\Category;
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
            'category_id' => null,
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $this->faker->paragraph(),
            'is_published' => false,
            'is_customizable' => false,
            'custom_additional_price' => $this->faker->optional()->randomFloat(2, 0, 20000),
            'discount_type' => $this->faker->optional()->randomElement(array_column(DiscountType::cases(), 'value')),
            'discount_value' => $this->faker->optional()->randomFloat(2, 0, 50000),
            'discount_start_at' => $this->faker->optional()->dateTimeBetween('-1 week', 'now'),
            'discount_end_at' => $this->faker->optional()->dateTimeBetween('now', '+1 week'),
        ];
    }
}
