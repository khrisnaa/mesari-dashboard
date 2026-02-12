<?php

namespace App\Http\Requests\Api\Order;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address_id'        => ['required', 'uuid', 'exists:user_addresses,id'],

            'shipping_courier'  => ['required', 'string', 'max:100'],
            'shipping_service'  => ['required', 'string', 'max:100'],
            'shipping_cost'     => ['required', 'numeric', 'min:0'],
            'shipping_weight'   => ['required', 'numeric', 'min:0'],

            'shipping_estimation' => ['nullable', 'string', 'max:50'],

            'payment_method'    => ['required', 'string', 'max:100'],
        ];
    }
}
