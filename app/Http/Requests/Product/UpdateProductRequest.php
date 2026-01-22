<?php

namespace App\Http\Requests\Product;

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
            'description' => ['nullable', 'string', 'max:255'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],

            'is_published' => ['nullable', 'boolean'],

            'variants' => ['required', 'string'],

            'image_state' => ['sometimes', 'string'],
            'images_upload' => ['sometimes', 'array'],
            'images_upload.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],

            'discount.type' => ['nullable', 'in:percentage,fixed'],
            'discount.value' => ['nullable', 'numeric', 'min:0'],
            'discount.start_at' => ['nullable', 'date'],
            'discount.end_at' => ['nullable', 'date', 'after_or_equal:discount.start_at'],

        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a valid string.',
            'name.max' => 'Product name cannot exceed 255 characters.',

            'description.string' => 'Description must be a valid string.',
            'description.max' => 'Description cannot exceed 255 characters.',

            'category_id.required' => 'Category is required.',
            'category_id.uuid' => 'Category ID must be a valid UUID.',
            'category_id.exists' => 'Selected category does not exist.',

            'variants.required' => 'At least one variant is required.',
            'variants.string' => 'Variants must be a valid JSON string.',

            'image_state.string' => 'Image state must be a valid JSON string.',
            'images_upload.array' => 'Uploaded images must be an array.',
            'images_upload.*.required' => 'Each uploaded image is required.',
            'images_upload.*.file' => 'Each uploaded image must be a file.',
            'images_upload.*.image' => 'Each uploaded file must be an image.',
            'images_upload.*.mimes' => 'Each uploaded image must be in JPG, JPEG, PNG, or WEBP format.',
            'images_upload.*.max' => 'Each uploaded image may not exceed 10MB.',

            'discount.type.in' => 'Discount type must be "percentage" or "fixed".',
            'discount.value.numeric' => 'Discount value must be a number.',
            'discount.start_at.date' => 'Start date must be a valid date.',
            'discount.end_at.date' => 'End date must be a valid date.',
            'discount.end_at.after_or_equal' => 'End date must be on or after the start date.',
        ];
    }
}
