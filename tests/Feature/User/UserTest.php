<?php

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

// setup & seeding
beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $this->actingAs($user);
});


it('can access the users index page', function () {
    User::factory()->count(3)->create();

    $this->get(route('users.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('users/index')
                ->has('users')
        );
});


it('can update a user', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
        'password' => bcrypt('oldpassword123'),
    ]);

    $update = [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'is_active' => true,
    ];

    $this->put(route('users.update', $user), $update)
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
        'is_active' => true,
    ]);


    $this->assertTrue(
        Hash::check('oldpassword123', User::find($user->id)->password)
    );
});



it('can update user status', function () {
    $user = User::factory()->create([
        'is_active' => false
    ]);

    $update = [
        'is_active' => true
    ];

    $this->put(route('users.update.status', $user), $update)
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'is_active' => true
    ]);
});
