<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAddressResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'               => $this->id,
            'recipient_name'   => $this->recipient_name,
            'phone'            => $this->phone,
            'label'            => $this->label,
            'address_line'     => $this->address_line,
            'province_id'      => $this->province_id,
            'province_name'    => $this->province_name,
            'city_id'          => $this->city_id,
            'city_name'        => $this->city_name,
            'subdistrict_id'   => $this->subdistrict_id,
            'subdistrict_name' => $this->subdistrict_name,
            'postal_code'      => $this->postal_code,
            'is_default'       => (bool) $this->is_default,
        ];
    }
}
