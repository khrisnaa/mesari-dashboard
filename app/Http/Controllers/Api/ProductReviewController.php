<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Review\StoreProductReviewRequest;
use App\Http\Requests\Api\Review\UpdateProductReviewRequest;
use App\Models\ProductReview;

class ProductReviewController extends Controller
{
    public function __construct(
        protected ProductReview $productReview
    ) {}

    public function store(StoreProductReviewRequest $request)
    {
        return $this->productReview->store($request->validated());
    }

    public function update(UpdateProductReviewRequest $request, $id)
    {
        $review = ProductReview::findOrFail($id);

        return $this->productReview->update($review, $request->validated());
    }
}
