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


it('can access user edit page', function () {
    $user = User::factory()->create();

    $this->get(route('users.edit', $user))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('users/edit')
                ->has('user')
        );
});


it('can update a user', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $update = [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'password' => 'newpassword123',
        'status' => 'active', // sesuaikan dengan enum UserStatus
    ];

    $this->put(route('users.update', $user), $update)
        ->assertRedirect(route('users.index'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
    ]);

    // Password must be hashed
    $this->assertTrue(
        Hash::check('newpassword123', User::find($user->id)->password)
    );
});
