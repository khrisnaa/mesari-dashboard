<?php

use App\Models\CompanyProfile;
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


it('can access the company profile edit page', function () {
    CompanyProfile::factory()->create();

    $this->get(route('company-profile.edit'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('company-profile/edit')
                ->has('profile')
        );
});


it('can update the company profile', function () {
    $profile = CompanyProfile::factory()->create([
        'company_name' => 'Old Company',
    ]);

    $update = [
        'company_name' => 'New Company Name',
        'tagline' => 'New tagline',
        'description' => 'Updated company description',
        'email' => 'newemail@example.com',
        'phone' => '08123456789',
        'whatsapp' => '08123456789',
        'address' => 'New Address Street',
        'city' => 'New City',
        'province' => 'New Province',
        'postal_code' => '12345',
        'google_map_url' => 'https://maps.google.com/new',
        'working_hours' => '09:00 - 17:00',
        'instagram' => '@newinsta',
        'tiktok' => '@newtiktok',
        'facebook' => 'facebook.com/new',
        'shopee' => 'shopee.com/new',
        'tokopedia' => 'tokopedia.com/new',
    ];

    $this->put(route('company-profile.update', $profile), $update)
        ->assertRedirect(route('company-profile.index'));

    $this->assertDatabaseHas('company_profiles', [
        'id' => $profile->id,
        'company_name' => 'New Company Name',
        'email' => 'newemail@example.com',
    ]);
});
