<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'              => $this->id,
            'order_status'          => $this->status,
            'subtotal'        => $this->subtotal,
            'total'           => $this->total,
            'payment_method'  => $this->payment_method,
            'payment_status'  => $this->payment_status,
            'shipping' => [
                'courier'  => $this->shipping_courier,
                'service'  => $this->shipping_service,
                'cost'     => $this->shipping_cost,
                'weight'   => $this->shipping_weight,
                'etd'      => $this->shipping_etd,
            ],
            'address' => [
                'recipient_name'   => $this->address->recipient_name,
                'phone'            => $this->address->phone,
                'address_line'     => $this->address->address_line,
                'province'         => $this->address->province_name,
                'city'             => $this->address->city_name,
                'subdistrict'      => $this->address->subdistrict_name,
                'postal_code'      => $this->address->postal_code,
            ],
            'items' => $this->items->map(function ($item) {
                return [
                    'id'               => $item->id,
                    'product_id'       => $item->product_id,
                    'product_name'     => $item->product_name,
                    'variant_name'     => $item->variant_name,
                    'price'            => $item->price,
                    'quantity'         => $item->quantity,
                    'subtotal'         => $item->subtotal,
                ];
            }),
            'created_at' => $this->created_at->toDateTimeString(),
        ];
    }
}
