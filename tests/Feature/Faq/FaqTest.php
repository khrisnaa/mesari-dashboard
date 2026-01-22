<?php

use App\Models\Faq;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
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


it('can access faq index page', function () {
    Faq::factory()->count(3)->create();

    $this->get(route('faqs.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('faqs/index')
                ->has('faqs')
        );
});





it('can store a faq', function () {
    $data = [
        'question' => 'What is Laravel?',
        'answer' => 'Laravel is a PHP framework.',
        'sort_order' => 1,
        'is_published' => true,
    ];

    $this->post(route('faqs.store'), $data)
        ->assertRedirect(route('faqs.index'));

    $this->assertDatabaseHas('faqs', [
        'question' => 'What is Laravel?',
        'answer' => 'Laravel is a PHP framework.',
    ]);
});


// it('can access faq edit page', function () {
//     $faq = Faq::factory()->create();

//     $this->get(route('faqs.edit', $faq))
//         ->assertStatus(200)
//         ->assertInertia(
//             fn($page) => $page
//                 ->component('faqs/edit')
//                 ->has('faq')
//         );
// });


it('can update a faq', function () {
    $faq = Faq::factory()->create([
        'question' => 'Old question',
    ]);

    $update = [
        'question' => 'New updated question',
        'answer' => 'Updated answer',
        'sort_order' => 5,
        'is_published' => false,
    ];

    $this->put(route('faqs.update', $faq), $update)
        ->assertRedirect(route('faqs.index'));

    $this->assertDatabaseHas('faqs', [
        'id' => $faq->id,
        'question' => 'New updated question',
    ]);
});


it('can delete a faq', function () {
    $faq = Faq::factory()->create();

    $this->delete(route('faqs.destroy', $faq))
        ->assertRedirect(route('faqs.index'));

    $this->assertSoftDeleted('faqs', [
        'id' => $faq->id,
    ]);
});
