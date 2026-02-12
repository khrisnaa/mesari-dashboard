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
            'quantity'           => ['required', 'integer', 'min:1'],
            'address_id'         => ['required', 'uuid', 'exists:user_addresses,id'],
            'shipping_courier'   => ['required', 'string', 'max:100'],
            'shipping_service'   => ['required', 'string', 'max:100'],
            'shipping_cost'      => ['required', 'numeric', 'min:0'],
            'shipping_weight'    => ['required', 'numeric', 'min:0'],
            'shipping_estimation' => ['nullable', 'string', 'max:50'],
            'payment_method'     => ['required', 'string', 'max:100'],
        ];
    }
}
