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
            'total_items' => $this->items->sum('quantity'),
            'total' => (float) $this->total,
            'created_at' => $this->created_at,
        ];
    }
}
