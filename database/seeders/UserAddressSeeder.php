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
        $citiesJson = json_decode(file_get_contents(database_path('data/cities.json')), true);
        $addressesJson = json_decode(file_get_contents(database_path('data/user_addresses.json')), true);

        foreach ($citiesJson as $city) {
            DB::table('cities')->updateOrInsert(
                ['id' => $city['id']],
                [
                    'province_name' => $city['province_name'],
                    'city_name' => $city['city_name'],
                    'type' => $city['type'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            );
        }

        foreach ($addressesJson as $email => $addressList) {
            $user = User::where('email', $email)->first();

            if (!$user) {
                continue;
            }

            foreach ($addressList as $addr) {
                $city = collect($citiesJson)->firstWhere('id', $addr['city_id']);

                DB::table('user_addresses')->insert([
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'city_id' => $addr['city_id'],
                    'recipient_name' => $addr['recipient_name'],
                    'phone' => $addr['phone'],
                    'label' => $addr['label'],
                    'address_line' => $addr['address_line'],
                    'province_name' => $city['province_name'],
                    'city_name' => $city['city_name'],
                    'postal_code' => $addr['postal_code'],
                    'is_default' => $addr['is_default'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    public function test(): void
    {
        $users = User::whereIn('email', ['member@example.com', 'guest@example.com'])->get();

        foreach ($users as $user) {
            for ($i = 0; $i < 3; $i++) {
                $city = City::factory()->create();

                UserAddress::factory()->create([
                    'user_id' => $user->id,
                    'city_id' => $city->id,
                    'province_name' => $city->province_name,
                    'city_name' => $city->city_name,
                ]);
            }
        }
    }
}
