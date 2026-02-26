<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar' => $this->avatar ? asset('storage/'.$this->avatar) : null,
            'is_active' => (bool) $this->is_active,
            'email_verified_at' => $this->whenNotNull($this->email_verified_at),
        ];
    }
}
