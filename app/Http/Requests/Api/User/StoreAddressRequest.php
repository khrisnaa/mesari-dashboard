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

    public function messages(): array
    {
        return [
            'ro_subdistrict_id.required' => 'The subdistrict ID is required.',
            'ro_subdistrict_id.integer' => 'The subdistrict ID must be an integer.',

            'recipient_name.required' => 'The recipient name is required.',
            'recipient_name.string' => 'The recipient name must be a valid string.',

            'phone.required' => 'The phone number is required.',
            'phone.string' => 'The phone number must be a valid string.',

            'label.required' => 'The address label is required.',
            'label.string' => 'The address label must be a valid string.',

            'address_line.required' => 'The address line is required.',
            'address_line.string' => 'The address line must be a valid string.',

            'province_name.required' => 'The province name is required.',
            'province_name.string' => 'The province name must be a valid string.',

            'city_name.required' => 'The city name is required.',
            'city_name.string' => 'The city name must be a valid string.',

            'district_name.required' => 'The district name is required.',
            'district_name.string' => 'The district name must be a valid string.',

            'subdistrict_name.string' => 'The subdistrict name must be a valid string.',

            'postal_code.integer' => 'The postal code must be an integer.',

            'is_default.boolean' => 'The default flag must be true or false.',
        ];
    }
}
