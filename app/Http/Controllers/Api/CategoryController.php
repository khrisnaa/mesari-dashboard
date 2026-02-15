<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::whereHas('products')
            ->orderBy('name', 'asc')
            ->get();


        return ApiResponse::success(
            "List of categories",
            CategoryResource::collection($categories)
        );
    }
}
