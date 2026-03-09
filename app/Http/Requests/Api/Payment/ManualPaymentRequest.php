<?php

namespace App\Http\Requests\Api\Payment;

use Illuminate\Foundation\Http\FormRequest;

class ManualPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => ['required', 'exists:orders,id'],
            'payment_method_id' => ['required', 'exists:bank_accounts,id'],
            'payment_proof' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_id.required' => 'The order ID is required.',
            'order_id.exists' => 'The selected order does not exist.',

            'payment_method_id.required' => 'The payment method ID is required.',
            'payment_method_id.exists' => 'The selected payment method does not exist.',

            'payment_proof.image' => 'The payment proof must be an image file.',
            'payment_proof.mimes' => 'The payment proof must be a JPG or PNG image.',
            'payment_proof.max' => 'The payment proof may not be larger than 2MB.',
        ];
    }
}
