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
            'ro_subdistrict_id' => ['sometimes', 'integer'],

            'recipient_name' => ['sometimes', 'string'],
            'phone' => ['sometimes', 'string'],
            'label' => ['sometimes', 'string'],
            'address_line' => ['sometimes', 'string'],

            'province_name' => ['sometimes', 'string'],
            'city_name' => ['sometimes', 'string'],
            'district_name' => ['sometimes', 'string'],

            'subdistrict_name' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'integer'],

            'is_default' => ['nullable', 'boolean'],
        ];
    }
}
