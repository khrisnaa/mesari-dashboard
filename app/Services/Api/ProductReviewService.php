<?php

namespace App\Services\Api;

use App\Helpers\ApiResponse;
use App\Http\Resources\ProductReviewResource;
use App\Models\OrderItem;
use App\Models\ProductReview;

class ProductReviewService
{
    public function store(array $data)
    {
        $orderItem = OrderItem::with('order')->findOrFail($data['order_item_id']);

        if ($orderItem->order->order_status !== 'completed') {
            return ApiResponse::error(
                'Reviews can only be created for orders that are completed.',
                403
            );
        }

        if (ProductReview::where('order_item_id', $data['order_item_id'])->exists()) {
            return ApiResponse::error(
                'You have already submitted a review for this item.',
                409
            );
        }

        $review = ProductReview::create([
            'product_id' => $data['product_id'],
            'order_item_id' => $data['order_item_id'],
            'rating' => $data['rating'],
            'title' => $data['title'] ?? null,
            'content' => $data['content'] ?? null,
            'is_published' => true,
        ]);

        return ApiResponse::success(
            'Review successfully added.',
            new ProductReviewResource($review),
            201
        );
    }

    public function update(ProductReview $review, array $data)
    {
        $review->update($data);

        return ApiResponse::success(
            'Review successfully updated.',
            new ProductReviewResource($review)
        );
    }
}
