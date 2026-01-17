<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyProfile>
 */
class CompanyProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_name' => $this->faker->company(),
            'tagline' => $this->faker->optional()->sentence(),
            'description' => $this->faker->optional()->paragraph(),

            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'whatsapp' => $this->faker->phoneNumber(),

            'address' => $this->faker->streetAddress(),
            'city' => $this->faker->city(),
            'province' => $this->faker->state(),
            'postal_code' => $this->faker->postcode(),

            'google_map_url' =>
            'https://maps.google.com/?q=' . $this->faker->latitude() . ',' . $this->faker->longitude(),

            'working_hours' => '08:00 - 17:00',

            'instagram' => $this->faker->optional()->url(),
            'tiktok' => $this->faker->optional()->url(),
            'facebook' => $this->faker->optional()->url(),
            'shopee' => $this->faker->optional()->url(),
            'tokopedia' => $this->faker->optional()->url(),
        ];;
    }
}
