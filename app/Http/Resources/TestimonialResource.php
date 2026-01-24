<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'role'         => $this->role,
            'content'      => $this->content,
            'sort_order'   => $this->sort_order,
            'is_published' => $this->is_published,
        ];
    }
}
