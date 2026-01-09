<?php

use App\Models\Category;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

// set-up and seeding database
beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $role = 'superadmin';
    $user = User::factory()->create();
    $user->assignRole($role);

    $this->actingAs($user);
});

// display a paginated category test
it('can access category index page', function () {
    Category::factory()->count(3)->create();

    $this->get(route('categories.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('categories/index')
        );
});

// show form create a new category test
it('can access create category page', function () {
    $this->get(route('categories.create'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('categories/create')
        );
});

// store a new category test
it('can store new category', function () {
    $payload = ['name' => 'T-Shirt'];

    $this->post(route('categories.store'), $payload)
        ->assertRedirect(route('categories.index'));

    $this->assertDatabaseHas('categories', [
        'name' => 'T-Shirt',
        'deleted_at' => null
    ]);
});

// show form edit a category test
it('can access edit category page', function () {
    $category = Category::factory()->create();

    $this->get(route('categories.edit', $category))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('categories/edit')
                ->has('category')
        );
});

// update a category test
it('can update category', function () {
    $category = Category::factory()->create(['name' => 'Old Name']);

    $this->put(route('categories.update', $category), [
        'name' => 'Updated Name'
    ])->assertRedirect(route('categories.index'));

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Updated Name'
    ]);
});

// soft-delete a category test
it('can soft delete category', function () {
    $category = Category::factory()->create();

    $this->delete(route('categories.destroy', $category))
        ->assertRedirect(route('categories.index'));

    $this->assertSoftDeleted('categories', [
        'id' => $category->id
    ]);
});
