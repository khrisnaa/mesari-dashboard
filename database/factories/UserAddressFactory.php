<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
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
            'city_id' => null,
            'recipient_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'label' => $this->faker->word(),
            'address_line' => $this->faker->address(),
            'province_name' => $this->faker->state(),
            'city_name' => $this->faker->city(),
            'postal_code' => $this->faker->postcode(),
            'is_default' => $this->faker->boolean(0)
        ];
    }
}
