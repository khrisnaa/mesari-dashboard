<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Product\ProductFilterRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductReviewResource;
use App\Services\Api\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService) {}

    public function index(ProductFilterRequest $request)
    {
        try {
            $products = $this->productService->paginate($request);

            return ApiResponse::success('List of products', ProductResource::collection($products), 200, [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
                'has_more' => $products->hasMorePages(),
            ]);
        } catch (ValidationException $e) {
            return ApiResponse::error('Invalid filter parameters.', $e->errors(), 422);
        } catch (Throwable $e) {
            return ApiResponse::error('Failed to load product list.', $e->getMessage(), 500);
        }
    }

    public function show(string $slug)
    {
        try {
            $result = $this->productService->show($slug);

            return ApiResponse::success('Product detail', $result);
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Product not found.', null, 404);
        } catch (Throwable $e) {
            return ApiResponse::error('Something went wrong.', $e->getMessage(), 500);
        }
    }

    public function reviews(Request $request, string $slug)
    {
        try {
            $perPage = $request->integer('per_page', 10);

            $reviews = $this->productService->getReviews($slug, $perPage);

            return ApiResponse::success(
                'List of product reviews',
                ProductReviewResource::collection($reviews),
                200,
                [

                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'per_page' => $reviews->perPage(),
                    'total' => $reviews->total(),
                    'has_more' => $reviews->hasMorePages(),
                ]
            );
        } catch (ModelNotFoundException $e) {
            return ApiResponse::error('Product not found.', null, 404);
        } catch (Throwable $e) {
            return ApiResponse::error('Failed to load product reviews.', $e->getMessage(), 500);
        }
    }
}
