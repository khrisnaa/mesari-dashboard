<?php

use App\Enums\BannerType;
use App\Models\Banner;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

// setup & seeding
beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $this->actingAs($user);
});


it('can access banner index page', function () {
    Banner::factory()->count(3)->create();

    $this->get(route('banners.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('banners/index')
                ->has('banners')
        );
});


it('can access banner create page', function () {
    $this->get(route('banners.create'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('banners/create')
        );
});


it('can store a banner', function () {
    $data = [
        'title' => 'Homepage Banner',
        'description' => 'Main banner description',
        'backdrop' => UploadedFile::fake()->image('backdrop.jpg'),
        'image' => UploadedFile::fake()->image('banner.jpg'),
        'cta_text' => 'Learn More',
        'cta_link' => 'https://example.com',
        'sort_order' => 1,
        'is_published' => true,
        'type' => BannerType::BANNER->value,
    ];

    $this->post(route('banners.store'), $data)
        ->assertRedirect(route('banners.index'));

    $this->assertDatabaseHas('banners', [
        'title' => 'Homepage Banner',
        'is_published' => true,
    ]);
});


it('can access banner edit page', function () {
    $banner = Banner::factory()->create();

    $this->get(route('banners.edit', $banner))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('banners/edit')
                ->has('banner')
        );
});


it('can update a banner', function () {
    $banner = Banner::factory()->create([
        'title' => 'Old Title',
    ]);

    $update = [
        'title' => 'New Title',
        'description' => 'Updated description',
        'backdrop_path' => 'backdrops/new.jpg',
        'image_path' => 'images/new.jpg',
        'sort_order' => 2,
        'is_published' => false,
        'type' => BannerType::POPUP->value,

    ];

    $this->from(route('banners.index'))
        ->put(route('banners.update', $banner), $update)
        ->assertRedirect(route('banners.index'));

    $this->assertDatabaseHas('banners', [
        'id' => $banner->id,
        'title' => 'New Title',
    ]);
});


it('can delete a banner', function () {
    $banner = Banner::factory()->create();

    $this->from(route('banners.index'))
        ->delete(route('banners.destroy', $banner))
        ->assertRedirect(route('banners.index'));

    $this->assertSoftDeleted('banners', [
        'id' => $banner->id,
    ]);
});
