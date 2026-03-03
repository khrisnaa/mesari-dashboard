<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request): array
    {
        $variant = $this->variant;
        $product = $variant?->product;

        $now = now();
        $discountValue = (float) $product?->discount_value;
        $discountType = $product?->discount_type;

        $isDiscountActive = $discountValue > 0 &&
            ($product->discount_start_at === null || $now->greaterThanOrEqualTo($product->discount_start_at)) &&
            ($product->discount_end_at === null || $now->lessThanOrEqualTo($product->discount_end_at));

        $originalPrice = (float) $this->price;
        $finalUnitPrice = $originalPrice;

        if ($isDiscountActive) {
            if ($discountType === 'percentage') {
                $finalUnitPrice = $originalPrice - ($originalPrice * ($discountValue / 100));
            } elseif ($discountType === 'fixed') {
                $finalUnitPrice = max(0, $originalPrice - $discountValue);
            }
        }

        $subtotal = $finalUnitPrice * (int) $this->quantity;

        return [
            'id' => $this->id,
            'product' => [
                'id' => $product?->id,
                'name' => $product?->name,
                'image_url' => $product?->images
                    ?->firstWhere('type', 'thumbnail')
                    ?->path
                        ? asset('storage/'.$product->images->firstWhere('type', 'thumbnail')->path) : null,
                'discount' => [
                    'is_active' => $isDiscountActive,
                    'type' => $discountType,
                    'value' => $discountValue,
                ],
            ],
            'variant' => [
                'id' => $variant?->id,
                'attributes' => $variant?->attributes?->map(function ($attr) {
                    return $attr->name;
                })->values(),
                'stock' => $variant?->stock,
            ],
            'price' => (float) $finalUnitPrice,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $subtotal,
        ];
    }
}
