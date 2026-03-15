<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        $variant = $this->variant;
        $product = $variant?->product;
        $isCustomizable = (bool) $product?->is_customizable;

        $data = [
            'id' => $this->id,
            'product' => [
                'name' => $this->product_name,
                'image' => $product?->images?->firstWhere('type', 'thumbnail')?->path
                    ? asset('storage/'.$product->images->firstWhere('type', 'thumbnail')->path)
                    : null,
            ],
            'variant' => [
                'name' => $this->variant_name,
            ],
            'price' => (float) $this->price,
            'quantity' => (int) $this->quantity,
            'subtotal' => (float) $this->subtotal,
            'is_customizable' => $isCustomizable,
        ];

        if ($isCustomizable && $this->customization) {
            $rawDetails = is_string($this->customization->custom_details)
                ? json_decode($this->customization->custom_details, true)
                : $this->customization->custom_details;

            $details = [];

            if (is_array($rawDetails)) {
                foreach ($rawDetails as $side => $sideData) {
                    if (isset($sideData['mockup_url'])) {

                        if (str_starts_with($sideData['mockup_url'], 'http')) {
                            $fullUrl = $sideData['mockup_url'];
                        } else {

                            $cleanPath = ltrim($sideData['mockup_url'], '/');

                            if (! str_starts_with($cleanPath, 'storage/')) {
                                $fullUrl = asset('storage/'.$cleanPath);
                            } else {
                                $fullUrl = asset($cleanPath);
                            }
                        }

                        $details[$side] = [
                            'mockup_url' => $fullUrl,
                        ];
                    }
                }
            }

            $data['customization'] = [
                'id' => $this->customization->id,
                'custom_details' => $details,
            ];
        }

        return $data;
    }
}
