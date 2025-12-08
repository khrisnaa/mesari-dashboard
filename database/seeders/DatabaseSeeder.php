<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            // ProductSeeder::class
            AttributeSeeder::class
        ]);

        $users = [
            [
                'email' => 'superadmin@example.com',
                'name'  => 'Super Admin',
                'role'  => 'superadmin',
            ],
            [
                'email' => 'admin@example.com',
                'name'  => 'Admin User',
                'role'  => 'admin',
            ],
            [
                'email' => 'member@example.com',
                'name'  => 'Member User',
                'role'  => 'member',
            ],
            [
                'email' => 'guest@example.com',
                'name'  => 'Guest User',
                'role'  => 'guest',
            ],
        ];

        foreach ($users as $u) {
            $user = User::firstOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            $user->assignRole($u['role']);
        }
    }
}
