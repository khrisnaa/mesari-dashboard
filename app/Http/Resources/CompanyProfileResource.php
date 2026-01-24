<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'company_name'  => $this->company_name,
            'tagline'       => $this->tagline,
            'description'   => $this->description,

            'email'         => $this->email,
            'phone'         => $this->phone,
            'whatsapp'      => $this->whatsapp,

            'address'       => $this->address,
            'city'          => $this->city,
            'province'      => $this->province,
            'postal_code'   => $this->postal_code,
            'google_map_url' => $this->google_map_url,

            'working_hours' => $this->working_hours,

            'instagram'     => $this->instagram,
            'tiktok'        => $this->tiktok,
            'facebook'      => $this->facebook,
            'shopee'        => $this->shopee,
            'tokopedia'     => $this->tokopedia,
        ];
    }
}
