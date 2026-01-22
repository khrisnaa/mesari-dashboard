<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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

            'images' => ['sometimes', 'array'],
            'images.*.type' => ['required', 'in:thumbnail,gallery'],
            'images.*.file' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],

            'discount' => ['nullable', 'array'],

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

            'images.array' => 'Images must be an array.',
            'images.*.type.required' => 'Each image must have a type.',
            'images.*.type.in' => 'Image type must be either thumbnail or gallery.',
            'images.*.file.required' => 'Each image must have a file.',
            'images.*.file.file' => 'Each image must be a valid file.',
            'images.*.file.image' => 'Each file must be an image.',
            'images.*.file.mimes' => 'Each image must be in JPG, JPEG, PNG, or WEBP format.',
            'images.*.file.max' => 'Each image may not exceed 10MB.',

            'discount.type.in' => 'Discount type must be "percentage" or "fixed".',
            'discount.value.numeric' => 'Discount value must be a number.',
            'discount.start_at.date' => 'Start date must be a valid date.',
            'discount.end_at.date' => 'End date must be a valid date.',
            'discount.end_at.after_or_equal' => 'End date must be on or after the start date.',
        ];
    }
}
