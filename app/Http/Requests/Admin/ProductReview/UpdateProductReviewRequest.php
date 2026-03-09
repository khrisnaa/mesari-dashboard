<?php

namespace App\Http\Requests\Admin\ProductReview;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'is_published' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'is_published.required' => 'The publish status is required.',
            'is_published.boolean' => 'The publish status must be a boolean value (true or false).',
        ];
    }
}
