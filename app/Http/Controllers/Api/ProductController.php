<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Product\ProductFilterRequest;
use App\Services\Api\ProductService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Throwable;

class ProductController extends Controller
{

    public function __construct(
        protected ProductService $productService
    ) {}

    public function index(ProductFilterRequest $request)
    {
        try {
            $result = $this->productService->paginate($request);

            return ApiResponse::success("List of products", $result);
        } catch (ValidationException $e) {

            return ApiResponse::error(
                "Invalid filter parameters.",
                $e->errors(),
                422
            );
        } catch (Throwable $e) {

            return ApiResponse::error(
                "Failed to load product list.",
                $e->getMessage(),
                500
            );
        }
    }

    public function show(String $id)
    {
        try {
            $result = $this->productService->show($id);

            return ApiResponse::success("Product detail", $result);
        } catch (ModelNotFoundException $e) {

            return ApiResponse::error("Product not found.", null, 404);
        } catch (Throwable $e) {

            return ApiResponse::error(
                "Something went wrong.",
                $e->getMessage(),
                500
            );
        }
    }
}
