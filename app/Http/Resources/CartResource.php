<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'items' => CartItemResource::collection($this->items),
            'total' => (float) $this->items->sum('subtotal'),
            'total_quantity' => $this->items->sum('quantity'),
        ];
    }
}
