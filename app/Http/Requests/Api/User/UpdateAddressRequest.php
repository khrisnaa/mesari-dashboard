<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'recipient_name'   => ['sometimes', 'string', 'max:255'],
            'phone'            => ['sometimes', 'string', 'max:20'],
            'label'            => ['sometimes', 'string'],
            'address_line'     => ['sometimes', 'string'],
            'province_id'      => ['sometimes', 'string'],
            'province_name'    => ['sometimes', 'string'],
            'city_id'          => ['sometimes', 'string'],
            'city_name'        => ['sometimes', 'string'],
            'subdistrict_id'   => ['sometimes', 'string'],
            'subdistrict_name' => ['sometimes', 'string'],
            'postal_code'      => ['sometimes', 'string'],
            'is_default'       => ['sometimes', 'boolean'],
        ];
    }
}
