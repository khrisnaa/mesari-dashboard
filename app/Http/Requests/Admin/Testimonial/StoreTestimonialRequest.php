<?php

namespace App\Http\Requests\Admin\Testimonial;

use Illuminate\Foundation\Http\FormRequest;

class StoreTestimonialRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'role' => ['nullable', 'string', 'max:100'],
            'content' => ['required', 'string'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name cannot exceed 100 characters.',
            'role.string' => 'Role must be a valid string.',
            'role.max' => 'Role cannot exceed 100 characters.',
            'content.required' => 'Content is required.',
            'content.string' => 'Content must be a valid string.',
            'sort_order.integer' => 'Sort order must be an integer value.',
            'sort_order.min' => 'Sort order cannot be negative.',
            'sort_order.max' => 'The sort order cannot exceed 9999.',
            'is_published.required' => 'Publish status is required.',
            'is_published.boolean' => 'Publish status must be true or false.',
        ];
    }
}
