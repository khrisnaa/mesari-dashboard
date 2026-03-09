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
            'recipient_name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'max:20'],
            'label' => ['required', 'string', 'max:50'],
            'address_line' => ['required', 'string'],
            'province_name' => ['required', 'string', 'max:100'],
            'city_name' => ['required', 'string', 'max:100'],
            'district_name' => ['required', 'string', 'max:100'],
            'subdistrict_name' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'ro_subdistrict_id.required' => 'The subdistrict ID is required.',
            'ro_subdistrict_id.integer' => 'The subdistrict ID must be a valid integer.',
            'recipient_name.required' => 'The recipient name is required.',
            'recipient_name.max' => 'The recipient name cannot exceed 100 characters.',
            'phone.required' => 'The phone number is required.',
            'phone.max' => 'The phone number cannot exceed 20 characters.',
            'label.required' => 'The address label is required.',
            'label.max' => 'The label cannot exceed 50 characters.',
            'address_line.required' => 'The address line is required.',
            'province_name.required' => 'The province name is required.',
            'province_name.max' => 'The province name cannot exceed 100 characters.',
            'city_name.required' => 'The city name is required.',
            'city_name.max' => 'The city name cannot exceed 100 characters.',
            'district_name.required' => 'The district name is required.',
            'district_name.max' => 'The district name cannot exceed 100 characters.',
            'subdistrict_name.max' => 'The subdistrict name cannot exceed 100 characters.',
            'postal_code.max' => 'The postal code cannot exceed 10 characters.',
            'is_default.boolean' => 'The default flag must be true or false.',
        ];
    }
}
