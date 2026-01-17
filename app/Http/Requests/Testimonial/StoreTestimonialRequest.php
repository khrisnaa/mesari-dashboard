<?php

namespace App\Http\Requests\Testimonial;

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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'         => ['required', 'string', 'max:255'],
            'role'         => ['required', 'string', 'max:255'],
            'content'      => ['nullable', 'string'],
            'sort_order'   => ['nullable', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'         => 'Name is required.',
            'name.string'           => 'Name must be a valid string.',
            'name.max'              => 'Name cannot exceed 255 characters.',

            'role.required'         => 'Role is required.',
            'role.string'           => 'Role must be a valid string.',
            'role.max'              => 'Role cannot exceed 255 characters.',

            'content.string'        => 'Content must be a valid string.',

            'sort_order.integer'    => 'Sort order must be an integer value.',
            'sort_order.min'        => 'Sort order cannot be negative.',

            'is_published.required' => 'Publish status is required.',
            'is_published.boolean'  => 'Publish status must be true or false.',
        ];
    }
}
