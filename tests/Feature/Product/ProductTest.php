<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\AttributeSeeder;
use Database\Seeders\ProductSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\RolePermissionSeeder;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

// setup & seeding
beforeEach(function () {
    $this->seed(RolePermissionSeeder::class);

    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $this->actingAs($user);
});


it('can access product index page', function () {
    $this->seed(AttributeSeeder::class);
    $this->seed(ProductSeeder::class);

    $this->get(route('products.index'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) =>  $page
                ->component('products/index')
                ->has('products')
        );
});


it('can access create product page', function () {
    $this->seed(AttributeSeeder::class);
    Category::factory()->count(10)->create();

    $this->get(route('products.create'))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('products/create')
                ->has('categories')
                ->has('sizes')
                ->has('colors')
        );
});


it('can store new product', function () {
    $this->seed(AttributeSeeder::class);
    $category = Category::factory()->create();

    $payload = [
        'name' => 'Basic T-Shirt',
        'description' => 'Cotton t-shirt',
        'category_id' => $category->id,
        'is_published' => false,
        'variants' => json_encode([
            [
                'price' => 100000,
                'stock' => 10,
                'size' => ['id' => null],
                'color' => ['id' => null],
            ]
        ]),
        'images' => [
            [
                'type' => 'thumbnail',
                'file' => UploadedFile::fake()->image('thumbnail.jpg'),
            ],
            [
                'type' => 'gallery',
                'file' => UploadedFile::fake()->image('gallery.jpg'),
            ],
        ],
    ];

    $this->post(route('products.store'), $payload)
        ->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', [
        'name' => 'Basic T-Shirt',
        'category_id' => $category->id,
        'deleted_at' => null,
    ]);
});


it('can access edit product page', function () {
    $this->seed(AttributeSeeder::class);
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id
    ]);

    $this->get(route('products.edit', $product))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) =>
            $page->component('products/edit')
                ->has('product')
                ->has('categories')
                ->has('sizes')
                ->has('colors')
        );
});


it('can update product', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Old Product Name',
        'category_id' => $category->id,
    ]);

    $payload = [
        'name' => 'Updated Product Name',
        'description' => 'Updated description',
        'category_id' => $category->id,
        'is_published' => true,
        'variants' => json_encode([
            [
                'price' => 150000,
                'stock' => 20,
                'size' => ['id' => null],
                'color' => ['id' => null],
            ]
        ]),
        'image_state' => json_encode([]),
    ];

    $this->put(route('products.update', $product), $payload)
        ->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Product Name',
    ]);
});


it('can soft delete product', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id
    ]);

    $this->delete(route('products.destroy', $product))
        ->assertRedirect(route('products.index'));

    $this->assertSoftDeleted('products', [
        'id' => $product->id,
    ]);
});

it('can update product status', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'is_published' => true
    ]);

    $update = [
        'is_published' => false
    ];

    $this->from(route('products.index'))
        ->put(route('products.update.status', $product), $update)
        ->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'is_published' => false
    ]);
});
