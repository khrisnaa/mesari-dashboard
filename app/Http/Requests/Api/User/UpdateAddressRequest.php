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

    public function messages(): array
    {
        return [
            'ro_subdistrict_id.integer' => 'The subdistrict ID must be an integer.',

            'recipient_name.string' => 'The recipient name must be a valid string.',
            'phone.string' => 'The phone number must be a valid string.',
            'label.string' => 'The address label must be a valid string.',
            'address_line.string' => 'The address line must be a valid string.',

            'province_name.string' => 'The province name must be a valid string.',
            'city_name.string' => 'The city name must be a valid string.',
            'district_name.string' => 'The district name must be a valid string.',

            'subdistrict_name.string' => 'The subdistrict name must be a valid string.',

            'postal_code.integer' => 'The postal code must be an integer.',

            'is_default.boolean' => 'The default flag must be true or false.',
        ];
    }
}
