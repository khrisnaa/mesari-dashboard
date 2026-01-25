<?php

namespace App\Http\Requests\Api;

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
            'product_variant_id' => ['required', 'uuid'],
            'quantity'           => ['required', 'integer', 'min:1'],
            'address_id'         => ['required', 'uuid'],
            'shipping_courier'   => ['required', 'string'],
            'shipping_service'   => ['required', 'string'],
            'shipping_cost'      => ['required', 'numeric'],
            'shipping_weight'    => ['required', 'numeric'],
            'shipping_etd'       => ['required', 'date'],
            'payment_method'     => ['required', 'string'],
        ];
    }
}
