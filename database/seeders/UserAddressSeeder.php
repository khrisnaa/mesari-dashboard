<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
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
