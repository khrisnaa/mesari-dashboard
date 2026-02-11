<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $items = json_decode(file_get_contents(database_path('data/testimonials.json')), true);

        foreach ($items as $item) {
            DB::table('testimonials')->insert([
                'id'           => Str::uuid(),
                'name'         => $item['name'],
                'role'         => $item['role'],
                'content'      => $item['content'],
                'sort_order'   => $item['sort_order'],
                'is_published' => $item['is_published'],
                'created_at'   => now(),
                'updated_at'   => now()
            ]);
        }
    }

    public function test(): void
    {
        Testimonial::factory(5)->sequence(fn($sequence) => [
            'sort_order' => $sequence->index,
        ])->create();
    }
}
