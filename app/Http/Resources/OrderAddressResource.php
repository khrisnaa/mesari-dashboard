<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderAddressResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'recipient_name'   => $this->recipient_name,
            'phone'            => $this->phone,
            'address_line'     => $this->address_line,
            'province_name'    => $this->province_name,
            'city_name'        => $this->city_name,
            'postal_code'      => $this->postal_code,
        ];
    }
}
