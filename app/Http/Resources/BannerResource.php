<?php

namespace App\Http\Resources;

use App\Enums\BannerType;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $targetName = null;
        $targetSlug = null;

        if ($this->cta_type === BannerType::PRODUCT->value && $this->product) {
            $targetName = $this->product->name;
            $targetSlug = $this->product->slug;
        } elseif ($this->cta_type === BannerType::CATEGORY->value && $this->category) {
            $targetName = $this->category->name;
            $targetSlug = $this->category->slug;
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'backdrop_url' => $this->backdrop_path ? asset('storage/'.$this->backdrop_path) : null,
            'image_url' => $this->image_path ? asset('storage/'.$this->image_path) : null,
            'cta_text' => $this->cta_text,
            'cta_link' => $this->cta_link,
            'cta_target_id' => $this->cta_target_id,
            'cta_type' => $this->cta_type,

            'target_name' => $targetName,
            'target_slug' => $targetSlug,

            'target_products' => $this->cta_type === BannerType::PRODUCTS->value
                                 ? ProductResource::collection($this->whenLoaded('products'))
                                 : [],
        ];
    }
}
