<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request)
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
            'price' => $finalPrice,
            'original_price' => $originalPrice,
            'stock' => $this->stock,
            'attributes' => VariantAttributeResource::collection(
                $this->whenLoaded('attributes')
            ),
            'product' => $this->whenLoaded('product', function () use ($product, $isDiscountActive, $discountType, $discountValue) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'discount' => [
                        'is_active' => $isDiscountActive,
                        'type' => $discountType,
                        'value' => $discountValue,
                    ],
                ];
            }),
        ];
    }
}
