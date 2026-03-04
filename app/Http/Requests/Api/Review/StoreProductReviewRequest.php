<?php

namespace App\Http\Requests\Api\Review;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => 'required|uuid|exists:products,id',
            'order_item_id' => 'required|uuid|exists:order_items,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'content' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'Product ID is required.',
            'product_id.uuid' => 'Product ID must be a valid UUID.',
            'product_id.exists' => 'Product not found.',

            'order_item_id.required' => 'Order item ID is required.',
            'order_item_id.uuid' => 'Order item ID must be a valid UUID.',
            'order_item_id.exists' => 'Order item not found.',

            'rating.required' => 'Rating is required.',
            'rating.integer' => 'Rating must be an integer.',
            'rating.min' => 'Rating must be at least 1.',
            'rating.max' => 'Rating may not be greater than 5.',

            'title.max' => 'Title may not be longer than 255 characters.',
            'content.string' => 'Content must be a valid string.',
        ];
    }
}
