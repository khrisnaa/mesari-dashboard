<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderListResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'order_status'          => $this->status,
            'total'           => $this->total,
            'payment_status'  => $this->payment_status,
            'shipping_cost'   => $this->shipping_cost,
            'created_at'      => $this->created_at->toDateTimeString(),
            'address' => [
                'recipient_name' => $this->address->recipient_name,
                'city'           => $this->address->city_name,
            ],
        ];
    }
}
