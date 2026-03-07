<?php

namespace App\Http\Requests\Admin\CompanyProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],

            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'whatsapp' => ['required', 'string', 'max:50'],

            'address' => ['required', 'string', 'max:255'],

            'province_name' => ['required', 'string', 'max:100'],
            'city_name' => ['required', 'string', 'max:100'],
            'district_name' => ['nullable', 'string', 'max:100'],
            'subdistrict_name' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:20'],
            'origin_id' => ['required', 'integer'],

            'google_map_url' => ['required', 'string', 'max:255'],
            'working_hours' => ['required', 'string', 'max:255'],

            'instagram' => ['nullable', 'string', 'max:255'],
            'tiktok' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'company_name.string' => 'Company name must be a valid string.',
            'company_name.max' => 'Company name cannot exceed 255 characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',

            'phone.required' => 'Phone number is required.',
            'whatsapp.required' => 'Whatsapp number is required.',

            'address.required' => 'Address is required.',

            'province_name.required' => 'Province is required.',
            'city_name.required' => 'City is required.',
            'postal_code.required' => 'Postal code is required.',
            'origin_id.required' => 'Please select a valid location from the dropdown.',
            'origin_id.integer' => 'Origin ID must be a valid number.',

            'google_map_url.required' => 'Google Maps URL is required.',
            'working_hours.required' => 'Working hours information is required.',
        ];
    }
}
