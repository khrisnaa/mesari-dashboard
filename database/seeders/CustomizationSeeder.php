<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Product;

class CustomizationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereIn('email', [
            'member@example.com',
            'guest@example.com'
        ])->get();

        if ($users->isEmpty()) return;

        $products = Product::take(5)->get();
        if ($products->isEmpty()) return;

        foreach ($users as $user) {
            for ($i = 1; $i <= 2; $i++) {
                $product = $products->random();

                DB::table('customizations')->insert([
                    'id'               => Str::uuid(),
                    'user_id'          => $user->id,
                    'product_id'       => $product->id,
                    'image_path'       => '/dummy-custom-' . $i . '.png',
                    'image_position'   => json_encode(['x' => 0, 'y' => 0]),
                    'image_scale'      => json_encode(['scale' => 1]),
                    'image_rotation'   => 0,
                    'threejs_config'   => json_encode(['enabled' => false]),
                    'preview_image'    => '/dummy-preview-' . $i . '.png',
                    'additional_price' => rand(10000, 30000),
                    'is_draft'         => true,
                    'created_at'       => now(),
                    'updated_at'       => now()
                ]);
            }
        }
    }
}
