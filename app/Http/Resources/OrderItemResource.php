<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        $variant = $this->variant;
        $product = $variant?->product;

        return [
            'id' => $this->id,
            'product' => [
                'name' => $this->product_name,
                'image' => $product?->images?->firstWhere('type', 'thumbnail')?->path ? asset('storage/'.$product->images->firstWhere('type', 'thumbnail')->path) : null,
            ],
            'variant' => [
                'name' => $this->variant_name,
            ],
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $this->subtotal,
        ];
    }
}
