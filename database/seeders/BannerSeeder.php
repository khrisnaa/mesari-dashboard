<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = json_decode(file_get_contents(database_path('data/banners.json')), true);

        foreach ($banners as $item) {
            DB::table('banners')->insert([
                'id' => Str::uuid(),
                'title' => $item['title'],
                'description' => $item['description'],
                'backdrop_path' => $item['backdrop_path'],
                'image_path' => $item['image_path'],
                'cta_text' => $item['cta_text'],
                'cta_link' => $item['cta_link'],
                'sort_order' => $item['sort_order'],
                'is_published' => $item['is_published'],
                'cta_type' => $item['cta_type'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
