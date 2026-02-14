<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserAddressResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                => $this->id,
            'ro_subdistrict_id' => $this->ro_subdistrict_id,

            'recipient_name'    => $this->recipient_name,
            'phone'             => $this->phone,
            'label'             => $this->label,
            'address_line'      => $this->address_line,

            'province_name'     => $this->province_name,
            'city_name'         => $this->city_name,
            'district_name'     => $this->district_name,
            'subdistrict_name'  => $this->subdistrict_name,
            'postal_code'       => $this->postal_code,

            'is_default'        => (bool) $this->is_default,

            'created_at'        => $this->created_at?->toDateTimeString(),
            'updated_at'        => $this->updated_at?->toDateTimeString(),
        ];
    }
}
