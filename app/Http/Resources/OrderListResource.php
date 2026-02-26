<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{
    public function toArray($request): array
    {
        $isCompleted = $this->order_status === 'completed';

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,

            'summary' => $this->items->map(function ($item) use ($isCompleted) {
                $variant = $item->variant;
                $product = $variant?->product;
                $thumbnail = $product?->images?->firstWhere('type', 'thumbnail');

                $hasReview = $item->review !== null;

                return [
                    'order_item_id' => $item->id,
                    'product_id' => $product?->id,

                    'product_name' => $item->product_name,
                    'variant_name' => $item->variant_name,
                    'image' => $thumbnail?->path
                        ? asset('storage/'.$thumbnail->path)
                        : null,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,

                    'can_review' => $isCompleted && ! $hasReview,
                    'can_edit_review' => $hasReview,
                    'review_id' => $hasReview ? $item->review->id : null,
                    'review' => $hasReview ? new ProductReviewResource($item->review) : null,
                ];
            }),

            'quantity' => $this->items->sum('quantity'),
            'grand_total' => (float) $this->grand_total,
            'created_at' => $this->created_at,
        ];
    }
}
