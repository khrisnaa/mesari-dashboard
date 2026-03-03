<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->product;
        $now = now();

        $discountValue = (float) $product?->discount_value;
        $discountType = $product?->discount_type;

        $isDiscountActive = $discountValue > 0 &&
            ($product->discount_start_at === null || $now->greaterThanOrEqualTo($product->discount_start_at)) &&
            ($product->discount_end_at === null || $now->lessThanOrEqualTo($product->discount_end_at));

        $originalPrice = (float) $this->price;
        $finalPrice = $originalPrice;

        if ($isDiscountActive) {
            if ($discountType === 'percentage') {
                $finalPrice = $originalPrice - ($originalPrice * ($discountValue / 100));
            } elseif ($discountType === 'fixed') {
                $finalPrice = max(0, $originalPrice - $discountValue);
            }
        }

        return [
            'id' => $this->id,

            'price' => (float) $finalPrice,

            'original_price' => $originalPrice,

            'product' => [
                'id' => $product?->id,
                'name' => $product?->name,
                'image_url' => $product?->images
                    ?->firstWhere('type', 'thumbnail')
                    ?->path
                        ? asset('storage/'.$product->images->firstWhere('type', 'thumbnail')->path)
                        : null,

                'discount' => [
                    'is_active' => $isDiscountActive,
                    'type' => $discountType,
                    'value' => $discountValue,
                ],
            ],
            'variant' => [
                'id' => $this->id,
                'attributes' => $this->attributes?->map(function ($attr) {
                    return $attr->name;
                })->values(),
                'stock' => $this->stock,
            ],

            'stock' => (int) $this->stock,
        ];
    }
}
