<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\City>
 */
class CityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id'            => $this->faker->unique()->numberBetween(1, 5000),
            'province_name' => $this->faker->state(),
            'city_name'     => $this->faker->city(),
            'type'          => $this->faker->randomElement(['Kota', 'Kabupaten']),
        ];
    }
}
