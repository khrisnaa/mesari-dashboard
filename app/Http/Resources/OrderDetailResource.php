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
            'discount_amount' => (float) $this->discount_amount,
            'grand_total' => (float) $this->grand_total,

            'shipping' => [
                'recipient_name' => $this->recipient_name,
                'recipient_phone' => $this->recipient_phone,
                'recipient_address' => $this->recipient_address_line,
                'province' => $this->recipient_province,
                'city' => $this->recipient_city,
                'district' => $this->recipient_district,
                'subdistrict' => $this->recipient_subdistrict,
                'postal_code' => $this->postal_code,

                'courier' => $this->shipping_courier_code,
                'service' => $this->shipping_courier_service,
                'weight' => (int) $this->shipping_weight,
                'estimation' => $this->shipping_estimation,
                'tracking_number' => $this->shipping_tracking_number,
            ],

            'created_at' => $this->created_at,
        ];
    }
}
