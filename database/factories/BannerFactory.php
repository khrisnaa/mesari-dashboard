<?php

namespace Database\Factories;

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
            'title'          => $this->faker->sentence(3),
            'description'    => $this->faker->sentence(6),

            'backdrop_path'  => 'backdrops/' . $this->faker->uuid . '.jpg',
            'backdrop_url'   => $this->faker->imageUrl(1920, 1080, 'nature', true),

            'image_path'     => 'images/' . $this->faker->uuid . '.jpg',
            'image_url'      => $this->faker->imageUrl(1280, 720, 'business', true),

            'cta_text'       => $this->faker->optional()->words(2, true),
            'cta_link'       => $this->faker->optional()->url(),

            'sort_order'     => $this->faker->numberBetween(0, 10),
            'is_active'      => $this->faker->boolean(),
        ];
    }
}
