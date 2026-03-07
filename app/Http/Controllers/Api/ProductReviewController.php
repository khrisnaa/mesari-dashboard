<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Review\StoreProductReviewRequest;
use App\Http\Requests\Api\Review\UpdateProductReviewRequest;
use App\Models\ProductReview;
use App\Services\Api\ProductReviewService;

class ProductReviewController extends Controller
{
    public function __construct(
        protected ProductReviewService $productReviewService
    ) {}

    public function store(StoreProductReviewRequest $request)
    {
        return $this->productReviewService->store($request->validated());
    }

    public function update(UpdateProductReviewRequest $request, $id)
    {
        $review = ProductReview::findOrFail($id);

        return $this->productReviewService->update($review, $request->validated());
    }

    public function destroy($id)
    {
        $review = ProductReview::findOrFail($id);

        return $this->productReviewService->delete($review);
    }
}
