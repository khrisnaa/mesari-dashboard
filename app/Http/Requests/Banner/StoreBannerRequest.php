<?php

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
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
            'title'          => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'string', 'max:255'],
            'backdrop_path'  => ['required', 'string', 'max:255'],
            'backdrop_url'   => ['nullable', 'string', 'max:255'],
            'image_path'     => ['required', 'string', 'max:255'],
            'image_url'      => ['nullable', 'string', 'max:255'],
            'cta_text'       => ['nullable', 'string', 'max:255'],
            'cta_link'       => ['nullable', 'string', 'max:255'],
            'sort_order'     => ['nullable', 'integer', 'min:0'],
            'is_active'      => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.string'        => 'Title must be a valid string.',
            'title.max'           => 'Title cannot exceed 255 characters.',

            'description.string'  => 'Description must be a valid string.',
            'description.max'     => 'Description cannot exceed 255 characters.',

            'backdrop_path.required' => 'Backdrop path is required.',
            'backdrop_path.string'   => 'Backdrop path must be a valid string.',
            'backdrop_path.max'      => 'Backdrop path cannot exceed 255 characters.',

            'backdrop_url.string' => 'Backdrop URL must be a valid string.',
            'backdrop_url.max'    => 'Backdrop URL cannot exceed 255 characters.',

            'image_path.required' => 'Image path is required.',
            'image_path.string'   => 'Image path must be a valid string.',
            'image_path.max'      => 'Image path cannot exceed 255 characters.',

            'image_url.string'    => 'Image URL must be a valid string.',
            'image_url.max'       => 'Image URL cannot exceed 255 characters.',

            'cta_text.string'     => 'CTA text must be a valid string.',
            'cta_text.max'        => 'CTA text cannot exceed 255 characters.',

            'cta_link.string'     => 'CTA link must be a valid string.',
            'cta_link.max'        => 'CTA link cannot exceed 255 characters.',

            'sort_order.integer'  => 'Sort order must be an integer.',
            'sort_order.min'      => 'Sort order cannot be negative.',

            'is_active.required'  => 'Active status is required.',
            'is_active.boolean'   => 'Active status must be a boolean value.',
        ];
    }
}
