<?php

namespace Database\Seeders;

use App\Enums\AttributeType;
use App\Enums\VariantSize;
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
        $sizes = array_column(VariantSize::cases(), 'value');

        foreach ($sizes as $size) {
            Attribute::create([
                'name' => $size,
                'type' => AttributeType::SIZE->value,
                'hex' => null
            ]);
        }

        Attribute::factory()->count(5)->create();
    }
}
