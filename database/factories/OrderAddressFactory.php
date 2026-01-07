<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderAddress>
 */
class OrderAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => null,
            'recepient_name' => null,
            'phone' => null,
            'address_line' => null,
            'province_name' => null,
            'city_name' => null,
            'subdistrict_name' => null,
            'postal_code' => null
        ];
    }
}
