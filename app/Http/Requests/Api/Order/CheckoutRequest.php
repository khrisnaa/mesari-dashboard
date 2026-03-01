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
            'address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'shipping_courier_code' => ['required', 'string'],
            'shipping_courier_service' => ['required', 'string'],
            'note' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'address_id.required' => 'The address ID is required.',
            'address_id.uuid' => 'The address ID must be a valid UUID.',
            'address_id.exists' => 'The selected address does not exist.',

            'shipping_courier_code.required' => 'The shipping courier code is required.',
            'shipping_courier_code.string' => 'The shipping courier code must be a string.',

            'shipping_courier_service.required' => 'The shipping courier service is required.',
            'shipping_courier_service.string' => 'The shipping courier service must be a string.',

            'note.string' => 'The note must be a valid string.',
        ];
    }
}
