<?php

namespace Database\Factories;

use App\Enums\BannerType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->sentence(6),

            'backdrop_path' => 'backdrops/' . $this->faker->uuid . '.jpg',

            'image_path' => 'images/' . $this->faker->uuid . '.jpg',

            'cta_text' => $this->faker->optional()->words(2, true),
            'cta_link' => $this->faker->optional()->url(),

            'sort_order' => $this->faker->numberBetween(0, 10),
            'is_published' => $this->faker->boolean(),
            'type' => $this->faker->randomElement(array_column(BannerType::cases(), 'value')),
        ];
    }
}
