<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        $banners = Banner::with(['product', 'category', 'products'])
            ->where('is_published', true)
            ->orderBy('sort_order', 'asc')
            ->get();

        return ApiResponse::success('List of banners', BannerResource::collection($banners),
        );
    }
}
