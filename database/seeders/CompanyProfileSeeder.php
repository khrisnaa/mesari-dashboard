<?php

namespace Database\Seeders;

use App\Models\CompanyProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CompanyProfileSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/company_profile.json')), true);

        DB::table('company_profiles')->insert([
            'id' => Str::uuid(),
            'company_name' => $data['company_name'],
            'tagline' => $data['tagline'],
            'description' => $data['description'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'whatsapp' => $data['whatsapp'],
            'address' => $data['address'],

            'origin_id' => $data['origin_id'],
            'province_name' => $data['province_name'],
            'city_name' => $data['city_name'],
            'district_name' => $data['district_name'],
            'subdistrict_name' => $data['subdistrict_name'],
            'postal_code' => $data['postal_code'],

            'google_map_url' => $data['google_map_url'],
            'working_hours' => $data['working_hours'],
            'instagram' => $data['instagram'],
            'tiktok' => $data['tiktok'],
            'facebook' => $data['facebook'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test(): void
    {
        CompanyProfile::factory()->create();
    }
}
