<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttributeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id'   => $this->id,
            'name' => $this->name,
            'hex'  => $this->hex,
            'type' => $this->type,
        ];
    }
}
