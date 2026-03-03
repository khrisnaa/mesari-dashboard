<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray($request): array
    {
        $items = CartItemResource::collection($this->items);
        $total = collect($items)->sum('subtotal');

        return [
            'id' => $this->id,
            'items' => $items,
            'total' => (float) $total,
            'total_quantity' => $this->items->sum('quantity'),
        ];
    }
}
