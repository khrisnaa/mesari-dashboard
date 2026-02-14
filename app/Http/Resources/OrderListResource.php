<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{
    public function toArray($request): array
    {
        $firstItem = $this->items->first();
        $variant = $firstItem?->variant;
        $product = $variant?->product;

        return [
            'id' => $this->id,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'summary' => [
                'product_name' => $firstItem?->product_name,
                'variant_name' => $firstItem?->variant_name,
                'image' => $product?->images
                    ?->firstWhere('type', 'thumbnail')
                    ?->path,
            ],
            'quantity' => $this->items->sum('quantity'),
            'grand_total' => (float) $this->grand_total,
            'created_at' => $this->created_at,
        ];
    }
}
