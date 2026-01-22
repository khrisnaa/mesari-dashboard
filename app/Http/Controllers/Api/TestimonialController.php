<?php

namespace App\Http\Controllers\Api;

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

        return TestimonialResource::collection($testimonials);
    }
}
