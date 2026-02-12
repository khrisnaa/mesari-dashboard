<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray($request): array
    {
        $variant = $this->variant;
        $product = $variant?->product;

        return [
            'id' => $this->id,
            'product' => [
                'id' => $product?->id,
                'name' => $product?->name,
                'image' => $product?->images
                    ?->firstWhere('type', 'thumbnail')
                    ?->path,
            ],
            'variant' => [
                'id' => $variant?->id,
                'attributes' => $variant?->attributes?->map(function ($attr) {
                    return [
                        'name' => $attr->name,
                        'type' => $attr->type ?? null,
                    ];
                }),
            ],
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $this->subtotal,
        ];
    }
}
