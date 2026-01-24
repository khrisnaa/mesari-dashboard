<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;

class TestimonialController extends Controller
{

    public function index()
    {
        $testimonials = Testimonial::where('is_published', true)
            ->orderBy('sort_order', 'asc')
            ->limit(5)
            ->get();

        return ApiResponse::success("List of Testimonials", [
            "items" => TestimonialResource::collection($testimonials)
        ]);
    }
}
