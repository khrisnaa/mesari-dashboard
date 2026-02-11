<?php

namespace Database\Seeders;

use App\Enums\VariantAttributeType;
use App\Models\VariantAttribute;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VariantAttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = config('product.sizes');

        foreach ($sizes as $size) {
            VariantAttribute::create([
                'name' => $size['name'],
                'type' => VariantAttributeType::SIZE->value,
                'hex' => null
            ]);
        }

        $colors = config('product.colors');

        foreach ($colors as $color) {
            VariantAttribute::create([
                'name' => $color['name'],
                'type' => VariantAttributeType::COLOR->value,
                'hex' => $color['hex']
            ]);
        }
    }
}
