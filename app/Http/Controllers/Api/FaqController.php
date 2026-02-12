<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\FaqResource;
use App\Models\Faq;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::where('is_published', true)
            ->orderBy('sort_order', 'asc')
            ->limit(5)
            ->get();

        return ApiResponse::success(
            "List of FAQs",
            FaqResource::collection($faqs)
        );
    }
}
