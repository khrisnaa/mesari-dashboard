<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\AttributeType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class AttributeSeeder extends Seeder
{
    public function run(): void
    {


        $sizes = config('product.sizes');

        foreach ($sizes as $size) {
            Attribute::firstOrCreate([
                'name' => $size['name'],
                'type' => 'size',
            ], [
                'id' => Str::uuid(),
                'hex' => null,
            ]);
        }

        $colors = config('product.colors');

        foreach ($colors as $color) {
            Attribute::firstOrCreate([
                'name' => $color['name'],
                'type' => 'color',
            ], [
                'id' => Str::uuid(),
                'hex' => $color['hex'],
            ]);
        }
    }
}
