<?php

namespace App\Http\Requests\Admin\Banner;

use App\Enums\BannerType;
use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
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
            'title'       => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:255'],

            'backdrop' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'image'    => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:2048'],

            'cta_text'  => ['nullable', 'string', 'max:255'],
            'cta_link'  => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],

            'type' => ['required', 'in:' . implode(',', array_column(BannerType::cases(), 'value'))],
        ];
    }

    public function messages(): array
    {
        return [
            'title.string'        => 'Title must be a valid string.',
            'title.max'           => 'Title cannot exceed 255 characters.',

            'description.string'  => 'Description must be a valid string.',
            'description.max'     => 'Description cannot exceed 255 characters.',

            'backdrop.file'    => 'Backdrop must be a valid file.',
            'backdrop.mimes'   => 'Backdrop must be JPEG, PNG, JPG, or WEBP.',
            'backdrop.max'     => 'Backdrop file cannot exceed 2MB.',

            'image.file'       => 'Image must be a valid file.',
            'image.mimes'      => 'Image must be JPEG, PNG, JPG, or WEBP.',
            'image.max'        => 'Image file cannot exceed 2MB.',

            'cta_text.string'     => 'CTA text must be a valid string.',
            'cta_text.max'        => 'CTA text cannot exceed 255 characters.',

            'cta_link.string'     => 'CTA link must be a valid string.',
            'cta_link.max'        => 'CTA link cannot exceed 255 characters.',

            'sort_order.integer'  => 'Sort order must be an integer.',
            'sort_order.min'      => 'Sort order cannot be negative.',

            'is_published.required'  => 'Published status is required.',
            'is_published.boolean'   => 'Published status must be a boolean value.',

            'type.required' => 'Banner type is required.',
            'type.in'       => 'Banner type must be one of the allowed values.',
        ];
    }
}
