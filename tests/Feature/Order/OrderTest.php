<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderAddress;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\User;
use Database\Seeders\OrderSeeder;
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


it('can access orders index page', function () {
    $this->seed(OrderSeeder::class);

    $this->get(route('orders.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('orders/index')
                ->has('orders')
        );
});


it('can view order detail page', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id
    ]);

    $this->get(route('orders.show', $order))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('orders/show')
                ->has('order')
                ->where('order.id', $order->id)
        );
});


it('can update order status', function () {
    $user = User::factory()->create();
    $order = Order::factory()->create([
        'user_id' => $user->id,
        'status' => OrderStatus::PENDING->value,
        'payment_status' => PaymentStatus::PENDING->value,
    ]);

    $this->from(route('orders.index'))
        ->put(route('orders.update', $order), [
            'status' => OrderStatus::COMPLETED->value,
            'payment_status' => PaymentStatus::PAID->value,
        ])
        ->assertRedirect(route('orders.index'));

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => OrderStatus::COMPLETED->value,
        'payment_status' => PaymentStatus::PAID->value,
    ]);
});
