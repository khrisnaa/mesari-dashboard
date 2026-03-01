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
            'additional_price' => ['required', 'numeric', 'min:0'],
            // 'is_draft' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'additional_price.required' => 'Additional price is required.',
            'additional_price.numeric' => 'Additional price must be a valid number.',
            'additional_price.min' => 'Additional price cannot be negative.',
            // 'is_draft.required' => 'Draft status is required.',
            // 'is_draft.boolean' => 'Draft status must be true or false.',
        ];
    }
}
