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

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:100'],
            'tagline' => ['nullable', 'string', 'max:150'],
            'description' => ['nullable', 'string'],

            'email' => ['required', 'email', 'max:50'],
            'phone' => ['required', 'string', 'max:20'],
            'whatsapp' => ['required', 'string', 'max:20'],

            'address' => ['required', 'string'],

            'province_name' => ['required', 'string', 'max:100'],
            'city_name' => ['required', 'string', 'max:100'],
            'district_name' => ['nullable', 'string', 'max:100'],
            'subdistrict_name' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['required', 'string', 'max:10'],
            'origin_id' => ['required', 'integer'],

            'google_map_url' => ['required', 'string', 'max:255'],
            'working_hours' => ['required', 'string', 'max:100'],

            'instagram' => ['nullable', 'string', 'max:100'],
            'tiktok' => ['nullable', 'string', 'max:100'],
            'facebook' => ['nullable', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'company_name.string' => 'Company name must be a valid string.',
            'company_name.max' => 'Company name cannot exceed 100 characters.',

            'tagline.string' => 'Tagline must be a valid string.',
            'tagline.max' => 'Tagline cannot exceed 150 characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email cannot exceed 50 characters.',

            'phone.required' => 'Phone number is required.',
            'phone.string' => 'Phone number must be a valid string.',
            'phone.max' => 'Phone number cannot exceed 20 characters.',

            'whatsapp.required' => 'Whatsapp number is required.',
            'whatsapp.string' => 'Whatsapp number must be a valid string.',
            'whatsapp.max' => 'Whatsapp number cannot exceed 20 characters.',

            'address.required' => 'Address is required.',
            'address.string' => 'Address must be a valid string.',

            'province_name.required' => 'Province is required.',
            'province_name.string' => 'Province must be a valid string.',
            'province_name.max' => 'Province name cannot exceed 100 characters.',

            'city_name.required' => 'City is required.',
            'city_name.string' => 'City must be a valid string.',
            'city_name.max' => 'City name cannot exceed 100 characters.',

            'district_name.string' => 'District name must be a valid string.',
            'district_name.max' => 'District name cannot exceed 100 characters.',

            'subdistrict_name.string' => 'Subdistrict name must be a valid string.',
            'subdistrict_name.max' => 'Subdistrict name cannot exceed 100 characters.',

            'postal_code.required' => 'Postal code is required.',
            'postal_code.string' => 'Postal code must be a valid string.',
            'postal_code.max' => 'Postal code cannot exceed 10 characters.',

            'origin_id.required' => 'Please select a valid location from the dropdown.',
            'origin_id.integer' => 'Origin ID must be a valid number.',

            'google_map_url.required' => 'Google Maps URL is required.',
            'google_map_url.string' => 'Google Maps URL must be a valid string.',
            'google_map_url.max' => 'Google Maps URL cannot exceed 255 characters.',

            'working_hours.required' => 'Working hours information is required.',
            'working_hours.string' => 'Working hours must be a valid string.',
            'working_hours.max' => 'Working hours cannot exceed 100 characters.',

            'instagram.string' => 'Instagram must be a valid string.',
            'instagram.max' => 'Instagram cannot exceed 100 characters.',

            'tiktok.string' => 'Tiktok must be a valid string.',
            'tiktok.max' => 'Tiktok cannot exceed 100 characters.',

            'facebook.string' => 'Facebook must be a valid string.',
            'facebook.max' => 'Facebook cannot exceed 100 characters.',
        ];
    }
}
