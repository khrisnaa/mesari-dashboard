<?php

namespace App\Http\Requests\Api\Order;

use Illuminate\Foundation\Http\FormRequest;

class DirectCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_variant_id' => ['required', 'uuid', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer',],
            'address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'shipping_courier_code' => ['required', 'string'],
            'shipping_courier_service' => ['required', 'string'],
            'note' => ['nullable', 'string'],
        ];
    }
}
