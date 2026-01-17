<?php

use App\Http\Controllers\BannerController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');


Route::middleware(['auth', 'verified', 'role:admin|superadmin'])->group(function () {
    // Dashboard
    Route::get('dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

    // Categories
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])
            ->name('index');

        Route::post('/', [CategoryController::class, 'store'])
            ->name('store');

        Route::put('/{category}', [CategoryController::class, 'update'])
            ->name('update');

        Route::delete('/{category}', [CategoryController::class, 'destroy'])
            ->name('destroy');
    });

    // Products
    Route::prefix('products')->name('products.')->group(function () {

        Route::get('/', [ProductController::class, 'index'])
            ->name('index');

        Route::get('/create', [ProductController::class, 'create'])
            ->name('create');

        Route::post('/', [ProductController::class, 'store'])
            ->name('store');

        Route::get('/{product}', [ProductController::class, 'show'])
            ->name('show');

        Route::get('/{product}/edit', [ProductController::class, 'edit'])
            ->name('edit');

        Route::put('/{product}', [ProductController::class, 'update'])
            ->name('update');

        Route::delete('/{product}', [ProductController::class, 'destroy'])
            ->name('destroy');

        Route::post('/variant', [ProductController::class, 'storeVariant'])
            ->name('store.variant');
    });

    // Testimonials
    Route::prefix('testimonials')->name('testimonials.')->group(function () {

        Route::get('/', [TestimonialController::class, 'index'])
            ->name('index');

        Route::get('/create', [TestimonialController::class, 'create'])
            ->name('create');

        Route::post('/', [TestimonialController::class, 'store'])
            ->name('store');

        Route::get('/{testimonial}/edit', [TestimonialController::class, 'edit'])
            ->name('edit');

        Route::put('/{testimonial}', [TestimonialController::class, 'update'])
            ->name('update');

        Route::delete('/{testimonial}', [TestimonialController::class, 'destroy'])
            ->name('destroy');
    });

    Route::prefix('faqs')->name('faqs.')->group(function () {

        Route::get('/', [FaqController::class, 'index'])
            ->name('index');

        Route::get('/create', [FaqController::class, 'create'])
            ->name('create');

        Route::post('/', [FaqController::class, 'store'])
            ->name('store');

        Route::get('/{faq}/edit', [FaqController::class, 'edit'])
            ->name('edit');

        Route::put('/{faq}', [FaqController::class, 'update'])
            ->name('update');

        Route::delete('/{faq}', [FaqController::class, 'destroy'])
            ->name('destroy');
    });

    Route::prefix('banners')->name('banners.')->group(function () {

        Route::get('/', [BannerController::class, 'index'])
            ->name('index');

        Route::get('/create', [BannerController::class, 'create'])
            ->name('create');

        Route::post('/', [BannerController::class, 'store'])
            ->name('store');

        Route::get('/{banner}/edit', [BannerController::class, 'edit'])
            ->name('edit');

        Route::put('/{banner}', [BannerController::class, 'update'])
            ->name('update');

        Route::delete('/{banner}', [BannerController::class, 'destroy'])
            ->name('destroy');
    });

    Route::prefix('company-profile')->name('company-profile.')->group(function () {

        Route::get('/edit', [CompanyProfileController::class, 'edit'])
            ->name('edit');

        Route::put('/', [CompanyProfileController::class, 'update'])
            ->name('update');
    });

    Route::prefix('users')->name('users.')->group(function () {

        Route::get('/', [UserController::class, 'index'])
            ->name('index');

        Route::get('/{user}/edit', [UserController::class, 'edit'])
            ->name('edit');

        Route::put('/{user}', [UserController::class, 'update'])
            ->name('update');
    });

    Route::prefix('orders')->name('orders.')->group(function () {

        Route::get('/', [OrderController::class, 'index'])
            ->name('index');

        Route::get('/{order}', [OrderController::class, 'show'])
            ->name('show');

        Route::get('/{order}/edit', [OrderController::class, 'edit'])
            ->name('edit');

        Route::put('/{order}', [OrderController::class, 'update'])
            ->name('update');
    });
});


require __DIR__ . '/settings.php';
