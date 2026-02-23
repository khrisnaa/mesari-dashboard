<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {

        $user = $this->orderItem->order->user;
        $variant = $this->orderItem->variant;

        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'title' => $this->title,
            'content' => $this->content,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ],

            'variant' => [
                'id' => $variant?->id,
                'price' => $variant?->price,
                'attributes' => $variant
                    ? $variant->attributes->pluck('name')
                    : [],
            ],

            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
