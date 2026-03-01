<?php

namespace App\Http\Requests\Api\Customization;

use Illuminate\Foundation\Http\FormRequest;

class CustomizationCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customization_id' => ['required', 'uuid', 'exists:customizations,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'address_id' => ['required', 'uuid', 'exists:user_addresses,id'],
            'shipping_courier_code' => ['required', 'string'],
            'shipping_courier_service' => ['required', 'string'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'customization_id.required' => 'The customization ID is required.',
            'customization_id.uuid' => 'The customization ID must be a valid UUID.',
            'customization_id.exists' => 'The selected customization does not exist.',

            'quantity.required' => 'The quantity is required.',
            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 1.',

            'address_id.required' => 'The address ID is required.',
            'address_id.uuid' => 'The address ID must be a valid UUID.',
            'address_id.exists' => 'The selected address does not exist.',

            'shipping_courier_code.required' => 'The shipping courier code is required.',
            'shipping_courier_code.string' => 'The shipping courier code must be a string.',

            'shipping_courier_service.required' => 'The shipping courier service is required.',
            'shipping_courier_service.string' => 'The shipping courier service must be a string.',

            'note.string' => 'The note must be a valid string.',
            'note.max' => 'The note may not be greater than 255 characters.',
        ];
    }
}
