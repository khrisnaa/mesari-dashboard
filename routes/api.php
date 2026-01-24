<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyProfileController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;



// authentication
Route::post('/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);

Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');

Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
});


// public
Route::get('/faqs', [FaqController::class, 'index']);

Route::get('/testimonials', [TestimonialController::class, 'index']);

Route::get('/products', [ProductController::class, 'index']);

Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/company-detail', [CompanyProfileController::class, 'index']);

// authenticated
Route::middleware('auth:sanctum')->group(function () {});
