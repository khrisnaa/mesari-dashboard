<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'province_name' => $this->province_name,
            'city_name' => $this->city_name,
            'type' => $this->type,
        ];
    }
}
