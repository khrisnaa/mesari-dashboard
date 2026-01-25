<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id'           => $this->id,
            'category_id'  => $this->category_id,
            'name'         => $this->name,
            'slug'         => $this->slug,
            'description'  => $this->description,
            'is_published' => $this->is_published,


            'category' => new CategoryResource($this->whenLoaded('category')),
            'images'   => ProductImageResource::collection($this->whenLoaded('images')),
            'discount' => new ProductDiscountResource($this->whenLoaded('discount')),
            'variants' => ProductVariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
