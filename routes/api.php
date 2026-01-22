<?php

use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\TestimonialController;
use Illuminate\Support\Facades\Route;

// public
Route::get('/faqs', [FaqController::class, 'index']);
Route::get('/testimonials', [TestimonialController::class, 'index']);

// authenticated
Route::middleware('auth:sanctum')->group(function () {});
