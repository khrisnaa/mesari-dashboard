<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ro_subdistrict_id' => ['required', 'integer'],

            'recipient_name' => ['required', 'string'],
            'phone' => ['required', 'string'],
            'label' => ['required', 'string'],
            'address_line' => ['required', 'string'],

            'province_name' => ['required', 'string'],
            'city_name' => ['required', 'string'],
            'district_name' => ['required', 'string'],

            'subdistrict_name' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'integer'],

            'is_default' => ['nullable', 'boolean'],
        ];
    }
}
