<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id'    => $this->id,
            'price' => $this->price,
            'stock' => $this->stock,

            'attributes' => AttributeResource::collection(
                $this->whenLoaded('attributes')
            ),

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
