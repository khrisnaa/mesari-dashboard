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
            'order_id' => 'required|exists:orders,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'payment_proof' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
