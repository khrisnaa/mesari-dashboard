<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductDiscountResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id'       => $this->id,
            'type'     => $this->type,
            'value'    => $this->value,
            'start_at' => $this->start_at?->toISOString(),
            'end_at'   => $this->end_at?->toISOString(),
        ];
    }
}
