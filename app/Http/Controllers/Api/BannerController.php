<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Throwable;

class BannerController extends Controller
{
    public function index()
    {
        try {
            $banners = Banner::where('is_published', true)
                ->orderBy('sort_order', 'asc')
                ->get();

            return ApiResponse::success("List of banners", [
                'items' => BannerResource::collection($banners)
            ]);
        } catch (Throwable $e) {
            return ApiResponse::error(
                "Failed to load banners.",
                $e->getMessage(),
                500
            );
        }
    }
}
