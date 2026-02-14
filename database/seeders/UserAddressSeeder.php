<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserAddressSeeder extends Seeder
{
    public function run(): void
    {
        $roJson = collect(
            json_decode(file_get_contents(database_path('data/ro_subdistricts.json')), true)
        );

        $addressesJson = json_decode(
            file_get_contents(database_path('data/user_addresses.json')),
            true
        );

        foreach ($addressesJson as $email => $addressList) {

            $user = User::where('email', $email)->first();

            if (!$user) {
                continue;
            }

            foreach ($addressList as $addr) {

                $ro = $roJson->firstWhere('id', $addr['ro_subdistrict_id']);

                if (!$ro) {
                    continue; // skip jika id tidak ditemukan
                }

                DB::table('user_addresses')->insert([
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'ro_subdistrict_id' => $ro['id'],

                    'recipient_name' => $addr['recipient_name'],
                    'phone' => $addr['phone'],
                    'label' => $addr['label'],
                    'address_line' => $addr['address_line'],

                    'province_name' => $ro['province_name'],
                    'city_name' => $ro['city_name'],
                    'district_name' => $ro['district_name'],
                    'subdistrict_name' => $ro['subdistrict_name'],
                    'postal_code' => $ro['zip_code'],

                    'is_default' => $addr['is_default'] ?? false,

                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
