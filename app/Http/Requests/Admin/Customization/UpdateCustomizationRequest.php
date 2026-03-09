<?php

namespace App\Http\Requests\Admin\Customization;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'additional_price' => ['required', 'numeric', 'min:0', 'max:9999999999.99'],
        ];
    }

    public function messages(): array
    {
        return [
            'additional_price.required' => 'Additional price is required.',
            'additional_price.numeric' => 'Additional price must be a valid number.',
            'additional_price.min' => 'Additional price cannot be negative.',
            'additional_price.max' => 'Additional price exceeds the maximum allowed limit.',
        ];
    }
}
