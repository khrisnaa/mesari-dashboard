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
            'quantity' => ['nullable', 'integer', 'min:1'],
        ];
    }
}
