<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $now = now();

        $isDiscountActive = $this->discount_value > 0 &&
                            ($this->discount_start_at === null || $now->greaterThanOrEqualTo($this->discount_start_at)) &&
                            ($this->discount_end_at === null || $now->lessThanOrEqualTo($this->discount_end_at));

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_customizable' => (bool) $this->is_customizable,
            'custom_additional_price' => $this->custom_additional_price !== null ? (float) $this->custom_additional_price : null,
            'discount' => [
                'type' => $this->discount_type,
                'value' => $this->discount_value !== null ? (float) $this->discount_value : null,
                'is_active' => $isDiscountActive,
                'start_at' => $this->discount_start_at,
                'end_at' => $this->discount_end_at,
            ],
            'category' => new CategoryResource($this->whenLoaded('category')),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'thumbnail' => new ProductImageResource(
                $this->whenLoaded('images')
                    ->firstWhere('type', 'thumbnail')
            ),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
            'review_stats' => [
                'count' => $this->reviews_count ?? 0,
                'avg' => round($this->reviews_avg_rating ?? 0, 1),
            ],
            'created_at' => $this->created_at,

        ];
    }
}
