<?php

namespace Database\Seeders;

use App\Enums\AttributeType;
use App\Models\Attribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = config('product.sizes');

        foreach ($sizes as $size) {
            Attribute::create([
                'name' => $size['name'],
                'type' => AttributeType::SIZE->value,
                'hex' => null
            ]);
        }

        $colors = config('product.colors');

        foreach ($colors as $color) {
            Attribute::create([
                'name' => $color['name'],
                'type' => AttributeType::COLOR->value,
                'hex' => $color['hex']
            ]);
        }
    }
}
