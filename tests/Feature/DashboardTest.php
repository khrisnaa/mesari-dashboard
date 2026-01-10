<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $this->seed(RolePermissionSeeder::class);

        $role = 'superadmin';
        $user = User::factory()->create();
        $user->assignRole($role);

        $this->actingAs($user);

        $this->get(route('dashboard'))->assertOk();
    }
}
