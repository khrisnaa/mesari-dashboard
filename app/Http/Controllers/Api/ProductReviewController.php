<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductReviewResource;
use App\Models\OrderItem;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|uuid|exists:products,id',
            'order_item_id' => 'required|uuid|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        $orderItem = OrderItem::with('order')->findOrFail($validated['order_item_id']);

        if ($orderItem->order->order_status !== 'completed') {
            return ApiResponse::error(
                'Reviews can only be created for orders that are completed.',
                403
            );
        }

        $existingReview = ProductReview::where('order_item_id', $validated['order_item_id'])->exists();
        if ($existingReview) {
            return ApiResponse::error(
                'You have already submitted a review for this item.',
                409
            );
        }

        $review = ProductReview::create([
            'product_id' => $validated['product_id'],
            'order_item_id' => $validated['order_item_id'],
            'rating' => $validated['rating'],
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_published' => true,
        ]);

        return ApiResponse::success(
            'Review successfully added.',
            new ProductReviewResource($review),
            201
        );
    }

    public function update(Request $request, $id)
    {
        $review = ProductReview::findOrFail($id);

        $validated = $request->validate([
            'rating' => 'sometimes|required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ]);

        $review->update($validated);

        return ApiResponse::success(
            'Review successfully updated.',
            new ProductReviewResource($review)
        );
    }
}
