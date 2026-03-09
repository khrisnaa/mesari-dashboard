<?php

namespace App\Http\Requests\Api\Order;

use Illuminate\Foundation\Http\FormRequest;

class PreviewShippingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'product_variant_id' => ['nullable', 'uuid', 'exists:product_variants,id'],
            'quantity' => ['nullable', 'integer', 'min:1', 'max:999'],
        ];
    }

    public function messages(): array
    {
        return [
            'address_id.required' => 'The address ID is required.',
            'address_id.uuid' => 'The address ID must be a valid UUID.',
            'address_id.exists' => 'The selected address does not exist.',

            'product_variant_id.uuid' => 'The product variant ID must be a valid UUID.',
            'product_variant_id.exists' => 'The selected product variant does not exist.',

            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 1.',
            'quantity.max' => 'The quantity cannot exceed 999 units.',
        ];
    }
}
