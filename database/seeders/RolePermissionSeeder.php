<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;


class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $config = config('permission_map');

        $modules = $config['modules'];
        $roles   = $config['roles'];

        $allPermissions = [];

        // Generate all permissions from modules
        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $permName = "$module.$action";
                Permission::firstOrCreate(['name' => $permName]);
                $allPermissions[] = $permName;
            }
        }

        // Create roles & assign permissions
        foreach ($roles as $roleName => $assigned) {

            $role = Role::firstOrCreate(['name' => $roleName]);

            // '*' = all permissions
            if (in_array('*', $assigned)) {
                $role->syncPermissions($allPermissions);
                continue;
            }

            $expanded = [];

            foreach ($assigned as $item) {

                // wildcard module.* → expand
                if (str_ends_with($item, '.*')) {
                    $module = str_replace('.*', '', $item);

                    if (isset($modules[$module])) {
                        foreach ($modules[$module] as $action) {
                            $expanded[] = "$module.$action";
                        }
                    }
                    continue;
                }

                // single permission
                $expanded[] = $item;
            }

            $role->syncPermissions($expanded);
        }
    }
}
