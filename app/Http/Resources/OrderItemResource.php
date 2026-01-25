<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'product_id'        => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'product_name'      => $this->product_name,
            'variant_name'      => $this->variant_name,
            'price'             => $this->price,
            'quantity'          => $this->quantity,
            'subtotal'          => $this->subtotal,
        ];
    }
}
