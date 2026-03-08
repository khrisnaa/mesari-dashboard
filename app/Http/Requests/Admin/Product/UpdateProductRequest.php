<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],

            'weight' => ['nullable', 'integer'],
            'is_published' => ['required', 'boolean'],
            'is_customizable' => ['nullable', 'boolean'],
            'is_highlighted' => ['nullable', 'boolean'],

            'custom_additional_price' => ['nullable', 'numeric', 'min:0'],

            'variants' => ['required', 'string'],

            'image_state' => ['sometimes', 'string'],
            'images_upload' => ['sometimes', 'array'],
            'images_upload.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],

            'discount_type' => ['nullable', 'in:percentage,fixed'],
            'discount_value' => ['nullable', 'numeric', 'min:0'],
            'discount_start_at' => ['nullable', 'date'],
            'discount_end_at' => ['nullable', 'date', 'after_or_equal:discount_start_at'],

        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a valid string.',
            'name.max' => 'Product name cannot exceed 255 characters.',

            'description.string' => 'Description must be a valid string.',

            'category_id.required' => 'Category is required.',
            'category_id.uuid' => 'Category ID must be a valid UUID.',
            'category_id.exists' => 'Selected category does not exist.',

            'is_published.required' => 'Published status is required.',

            'variants.required' => 'At least one variant is required.',
            'variants.string' => 'Variants must be a valid JSON string.',

            'image_state.string' => 'Image state must be a valid JSON string.',
            'images_upload.array' => 'Uploaded images must be an array.',
            'images_upload.*.required' => 'Each uploaded image is required.',
            'images_upload.*.file' => 'Each uploaded image must be a file.',
            'images_upload.*.image' => 'Each uploaded file must be an image.',
            'images_upload.*.mimes' => 'Each uploaded image must be in JPG, JPEG, PNG, or WEBP format.',
            'images_upload.*.max' => 'Each uploaded image may not exceed 10MB.',

            'discount_type.in' => 'Discount type must be "percentage" or "fixed".',
            'discount_value.numeric' => 'Discount value must be a number.',
            'discount_start_at.date' => 'Start date must be a valid date.',
            'discount_end_at.date' => 'End date must be a valid date.',
            'discount_end_at.after_or_equal' => 'End date must be on or after the start date.',

            'custom_additional_price.numeric' => 'Additional price must be a valid number.',
            'custom_additional_price.min' => 'Additional price cannot be less than 0.',
        ];
    }
}
