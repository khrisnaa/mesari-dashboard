<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
{
    public function definition(): array
    {
        $jsonPath = database_path('data/ro_subdistricts.json');
        $roCollection = collect(json_decode(file_get_contents($jsonPath), true));

        $roData = $roCollection->random();

        return [
            'id' => Str::uuid(),
            'user_id' => User::factory(),
            'ro_subdistrict_id' => $roData['id'],

            'recipient_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'label' => 'Rumah',

            'address_line' => $this->faker->streetAddress(),

            'province_name' => $roData['province_name'],
            'city_name' => $roData['city_name'],
            'district_name' => $roData['district_name'],
            'subdistrict_name' => $roData['subdistrict_name'],
            'postal_code' => $roData['zip_code'],

            'is_default' => false,
        ];
    }
}
