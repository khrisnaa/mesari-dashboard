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

        $sizeType = AttributeType::firstOrCreate(
            ['name' => 'size'],
            ['id' => Str::uuid()]
        );

        $colorType = AttributeType::firstOrCreate(
            ['name' => 'color'],
            ['id' => Str::uuid()]
        );


        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        foreach ($sizes as $size) {
            Attribute::firstOrCreate([
                'name' => $size,
                'attribute_type_id' => $sizeType->id,
            ], [
                'id' => Str::uuid(),
                'hex' => null,
            ]);
        }

        $colors = [
            ['name' => 'Black',  'hex' => '#000000'],
            ['name' => 'White',  'hex' => '#FFFFFF'],
            ['name' => 'Red',    'hex' => '#FF0000'],
            ['name' => 'Blue',   'hex' => '#0000FF'],
            ['name' => 'Green',  'hex' => '#008000'],
            ['name' => 'Yellow', 'hex' => '#FFFF00'],
            ['name' => 'Gray',   'hex' => '#808080'],
        ];

        foreach ($colors as $color) {
            Attribute::firstOrCreate([
                'name' => $color['name'],
                'attribute_type_id' => $colorType->id,
            ], [
                'id' => Str::uuid(),
                'hex' => $color['hex'],
            ]);
        }
    }
}
