<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = json_decode(file_get_contents(database_path('data/faqs.json')), true);

        foreach ($faqs as $item) {
            DB::table('faqs')->insert([
                'id'           => Str::uuid(),
                'question'     => $item['question'],
                'answer'       => $item['answer'],
                'sort_order'   => $item['sort_order'],
                'is_published' => $item['is_published'],
                'created_at'   => now(),
                'updated_at'   => now()
            ]);
        }
    }

    public function test(): void
    {
        Faq::factory(10)->sequence(fn($sequence) => [
            'sort_order' => $sequence->index,
        ])->create();
    }
}
