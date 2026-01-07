<?php

namespace Database\Factories;

use App\Enums\AttributeType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attribute>
 */
class AttributeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(
            array_column(AttributeType::cases(), 'value')
        );

        return [
            'name' => $this->faker->word(),
            'type' => $type,
            'hex' => $type === AttributeType::COLOR->value
                ? $this->faker->hexColor()
                : null,

        ];
    }
}
