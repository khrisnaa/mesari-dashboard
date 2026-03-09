<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $config = config('permission_map');

        if (! empty($config['roles'])) {

            foreach ($config['roles'] as $roleName => $permissions) {
                Role::firstOrCreate(['name' => $roleName]);
            }
        }

        $users = [
            [
                'email' => 'superadmin@example.com',
                'name' => 'Super Admin',
                'role' => 'superadmin',
            ],
            [
                'email' => 'admin@example.com',
                'name' => 'Admin User',
                'role' => 'admin',
            ],
            [
                'email' => 'member@example.com',
                'name' => 'Member User',
                'role' => 'member',
            ],
            [
                'email' => 'guest@example.com',
                'name' => 'Former Guest User',
                'role' => 'member',
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
