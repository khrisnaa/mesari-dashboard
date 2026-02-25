<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\UserAddressController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});

// public routes
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{slug}/reviews', [ProductController::class, 'reviews']);
Route::get('/products/variant/{id}', [ProductController::class, 'variant']);
Route::get('/company-detail', [CompanyProfileController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);

// midtrans notification
Route::post('/midtrans/notification', [PaymentController::class, 'notification']);

// protected routes
Route::middleware('auth:sanctum')->group(function () {

    // user profile
    Route::get('/user', [UserController::class, 'edit']);
    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);

    // cart
    Route::get('/carts', [CartController::class, 'index']);
    Route::post('/carts', [CartController::class, 'addItem']);
    Route::put('/carts/{id}', [CartController::class, 'updateItem']);
    Route::delete('/carts/{id}', [CartController::class, 'deleteItem']);

    // user addresses
    Route::get('/addresses', [UserAddressController::class, 'index']);
    Route::post('/addresses', [UserAddressController::class, 'store']);
    Route::get('/addresses/{id}', [UserAddressController::class, 'show']);
    Route::put('/addresses/{id}', [UserAddressController::class, 'update']);
    Route::delete('/addresses/{id}', [UserAddressController::class, 'destroy']);

    // checkout
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::post('/checkout/direct', [OrderController::class, 'directCheckout']);

    // orders
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);

    // shipping cost
    Route::post('/shipping/preview', [OrderController::class, 'previewShipping']);

    // locations
    Route::get('/locations', [LocationController::class, 'index']);

    // payment
    Route::post('/payment', [PaymentController::class, 'store']);
    Route::get('/payment/check/{id}', [PaymentController::class, 'checkStatus']);
    Route::get('/payment-methods', [PaymentController::class, 'getMethods']);
    Route::post('/payment/manual', [PaymentController::class, 'storeManual']);
});
