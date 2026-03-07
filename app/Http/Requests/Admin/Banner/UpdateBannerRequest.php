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

            'title' => ['required', 'string'],
            'description' => ['required', 'string'],

            'backdrop' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5048'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5048'],

            'cta_type' => ['nullable', 'string', 'in:'.implode(',', array_column(BannerType::cases(), 'value'))],
            'cta_text' => ['nullable', 'string'],
            'cta_target_id' => ['nullable', 'uuid'],
            'cta_link' => ['nullable', 'string'],

            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['required', 'boolean'],

            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['uuid', 'exists:products,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Title is required.',
            'title.string' => 'Title must be a valid string.',
            'title.max' => 'Title cannot exceed 255 characters.',

            'description.required' => 'Description is required.',
            'description.string' => 'Description must be a valid string.',
            'description.max' => 'Description cannot exceed 255 characters.',

            'backdrop.image' => 'Backdrop must be a valid image.',
            'backdrop.mimes' => 'Backdrop must be JPEG, PNG, JPG, or WEBP.',
            'backdrop.max' => 'Backdrop file cannot exceed 5MB.',

            'image.image' => 'Image must be a valid image.',
            'image.mimes' => 'Image must be JPEG, PNG, JPG, or WEBP.',
            'image.max' => 'Image file cannot exceed 5MB.',

            'cta_type.required' => 'Banner type is required.',
            'cta_type.in' => 'Banner type must be one of the allowed values.',

            'cta_text.string' => 'CTA text must be a valid string.',
            'cta_text.max' => 'CTA text cannot exceed 255 characters.',

            'cta_target_id.uuid' => 'CTA target ID must be a valid UUID.',

            'cta_link.string' => 'CTA link must be a valid string.',
            'cta_link.max' => 'CTA link cannot exceed 255 characters.',

            'sort_order.integer' => 'Sort order must be an integer.',
            'sort_order.min' => 'Sort order cannot be negative.',

            'is_published.required' => 'Published status is required.',
            'is_published.boolean' => 'Published status must be a boolean value.',

            'product_ids.array' => 'Products selection must be an array.',
            'product_ids.*.uuid' => 'Each selected product must have a valid UUID.',
            'product_ids.*.exists' => 'One or more selected products do not exist.',
        ];
    }
}
