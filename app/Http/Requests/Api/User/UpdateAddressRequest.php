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
            'recipient_name' => ['sometimes', 'string', 'max:100'],
            'phone' => ['sometimes', 'string', 'max:20'],
            'label' => ['sometimes', 'string', 'max:50'],
            'address_line' => ['sometimes', 'string'],
            'province_name' => ['sometimes', 'string', 'max:100'],
            'city_name' => ['sometimes', 'string', 'max:100'],
            'district_name' => ['sometimes', 'string', 'max:100'],
            'subdistrict_name' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ro_subdistrict_id.integer' => 'The subdistrict ID must be a valid integer.',
            'recipient_name.max' => 'The recipient name cannot exceed 100 characters.',
            'phone.max' => 'The phone number cannot exceed 20 characters.',
            'label.max' => 'The label cannot exceed 50 characters.',
            'province_name.max' => 'The province name cannot exceed 100 characters.',
            'city_name.max' => 'The city name cannot exceed 100 characters.',
            'district_name.max' => 'The district name cannot exceed 100 characters.',
            'subdistrict_name.max' => 'The subdistrict name cannot exceed 100 characters.',
            'postal_code.max' => 'The postal code cannot exceed 10 characters.',
            'is_default.boolean' => 'The default flag must be true or false.',
        ];
    }
}
