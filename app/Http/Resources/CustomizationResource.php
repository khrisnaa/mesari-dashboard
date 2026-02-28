<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'product_variant_id' => $this->product_variant_id,
            'total_custom_sides' => $this->total_custom_sides,
            'custom_details' => json_decode($this->custom_details), // Decode agar FE menerima JSON object, bukan string
            'additional_price' => (float) $this->additional_price,
            'is_draft' => (bool) $this->is_draft,
            'created_at' => $this->created_at,
        ];
    }
}
