<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_status' => $this->order_status,
            'payment_status' => $this->payment_status,
            'payment_method' => $this->payment_method,

            'items' => OrderItemResource::collection($this->items),

            'subtotal' => (float) $this->subtotal,
            'shipping_cost' => (float) $this->shipping_cost,
            'total' => (float) $this->total,

            'shipping' => [
                'recipient_name' => $this->recipient_name,
                'recipient_phone' => $this->recipient_phone,
                'recipient_address' => $this->recipient_address,
                'province' => $this->province_name,
                'city' => $this->city_name,
                'postal_code' => $this->postal_code,
                'courier' => $this->shipping_courier,
                'service' => $this->shipping_service,
                'estimation' => $this->shipping_estimation,
            ],

            'created_at' => $this->created_at,
        ];
    }
}
