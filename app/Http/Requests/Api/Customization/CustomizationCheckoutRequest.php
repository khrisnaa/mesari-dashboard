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
            'quantity' => ['required', 'integer', 'min:1'], // FE bisa mengirim ulang quantity di sini
            'address_id' => ['required', 'uuid', 'exists:addresses,id'],
            'shipping_courier_code' => ['required', 'string'],
            'shipping_courier_service' => ['required', 'string'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
