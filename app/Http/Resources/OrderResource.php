<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'status'          => $this->status,
            'subtotal'        => $this->subtotal,
            'total'           => $this->total,
            'payment_method'  => $this->payment_method,
            'payment_status'  => $this->payment_status,
            'shipping_courier' => $this->shipping_courier,
            'shipping_service' => $this->shipping_service,
            'shipping_cost'   => $this->shipping_cost,
            'shipping_weight' => $this->shipping_weight,
            'shipping_etd'    => $this->shipping_etd,
            'address'         => new OrderAddressResource($this->address),
            'items'           => OrderItemResource::collection($this->items),
        ];
    }
}
