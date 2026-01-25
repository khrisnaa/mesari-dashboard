<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description,

            'backdrop_path' => $this->backdrop_path,
            'backdrop_url'  => $this->backdrop_url,

            'image_path'    => $this->image_path,
            'image_url'     => $this->image_url,

            'cta_text'      => $this->cta_text,
            'cta_link'      => $this->cta_link,

            'sort_order'    => $this->sort_order,
            'is_published'  => $this->is_published,
        ];
    }
}
