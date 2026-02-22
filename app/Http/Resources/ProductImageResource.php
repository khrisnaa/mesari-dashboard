<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImageResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'url' => $this->path ? asset('storage/'.$this->path) : null,
            'type' => $this->type,
            'sort_order' => $this->sort_order,
        ];
    }
}
