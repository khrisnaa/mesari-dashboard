<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $details = is_string($this->custom_details)
            ? json_decode($this->custom_details, true)
            : $this->custom_details;

        $baseImages = [];
        if ($this->relationLoaded('product') && $this->product->images) {
            foreach ($this->product->images as $img) {
                $key = $img->type;
                if ($key === 'left') {
                    $key = 'leftSleeve';
                }
                if ($key === 'right') {
                    $key = 'rightSleeve';
                }

                $path = $img->path;

                $baseImages[$key] = $path ? asset('storage/'.$path) : null;
            }
        }

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'total_custom_sides' => $this->total_custom_sides,
            'custom_details' => $details,
            'base_images' => $baseImages,
            'additional_price' => (float) $this->additional_price,
            'is_draft' => (bool) $this->is_draft,
            'created_at' => $this->created_at,
        ];
    }
}
