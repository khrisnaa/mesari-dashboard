<?php

use App\Models\Testimonial;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Database\Seeders\TestimonialSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

// setup & seeding
beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $this->actingAs($user);
});


it('can access testimonial index page', function () {
    $this->seed(TestimonialSeeder::class);

    $this->get(route('testimonials.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('testimonials/index')
                ->has('testimonials')
        );
});

// it('can access testimonial create page', function () {
//     $this->get(route('testimonials.create'))
//         ->assertStatus(200)
//         ->assertInertia(
//             fn($page) => $page
//                 ->component('testimonials/create')
//         );
// });

it('can store a testimonial', function () {
    $data = [
        'name' => 'John Doe',
        'role' => 'Engineer',
        'content' => 'Great platform!',
        'sort_order' => 1,
        'is_published' => true,
    ];

    $this->post(route('testimonials.store'), $data)
        ->assertRedirect(route('testimonials.index'));

    $this->assertDatabaseHas('testimonials', [
        'name' => 'John Doe',
        'role' => 'Engineer',
    ]);
});

// it('can access edit page', function () {
//     $testimonial = Testimonial::factory()->create();

//     $this->get(route('testimonials.edit', $testimonial))
//         ->assertStatus(200)
//         ->assertInertia(
//             fn($page) => $page
//                 ->component('testimonials/edit')
//                 ->has('testimonial')
//         );
// });

it('can update a testimonial', function () {
    $testimonial = Testimonial::factory()->create([
        'name' => 'Old Name',
    ]);

    $update = [
        'name' => 'New Name',
        'role' => 'Designer',
        'content' => 'Updated content',
        'sort_order' => 2,
        'is_published' => false,
    ];

    $this->put(route('testimonials.update', $testimonial), $update)
        ->assertRedirect(route('testimonials.index'));

    $this->assertDatabaseHas('testimonials', [
        'id' => $testimonial->id,
        'name' => 'New Name',
    ]);
});

it('can delete a testimonial', function () {
    $testimonial = Testimonial::factory()->create();

    $this->delete(route('testimonials.destroy', $testimonial))
        ->assertRedirect(route('testimonials.index'));

    $this->assertSoftDeleted('testimonials', [
        'id' => $testimonial->id,
    ]);
});
