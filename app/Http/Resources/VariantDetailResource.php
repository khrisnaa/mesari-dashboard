<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VariantDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $product = $this->product;

        return [
            'id' => $this->id,
            'price' => (float) $this->price,
            'product' => [
                'id' => $product?->id,
                'name' => $product?->name,
                'image_url' => $product?->images
                    ?->firstWhere('type', 'thumbnail')
                    ?->path
                        ? asset('storage/'.$product->images->firstWhere('type', 'thumbnail')->path)
                        : null,
            ],
            'variant' => [
                'id' => $this->id,
                'attributes' => $this->attributes?->map(function ($attr) {
                    return $attr->name;
                })->values(),
                'stock' => $this->stock,
            ],
            // Opsional: Jika frontend butuh data stock di luar objek variant juga
            'stock' => (int) $this->stock,
        ];
    }
}
