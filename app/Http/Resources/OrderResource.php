<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,

            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_price,
            'grand_total' => (float) $this->grand_total,

            'shipping' => [
                'courier' => $this->shipping_courier_code,
                'service' => $this->shipping_courier_service,
                'weight' => (float) $this->shipping_weight,
                'estimation' => $this->shipping_estimation,
            ],

            'items' => OrderItemResource::collection($this->items),
        ];
    }
}
