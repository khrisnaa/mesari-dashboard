<?php

namespace App\Http\Requests\Admin\PaymentMethod;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'bank_name' => ['sometimes', 'string', 'max:50'],
            'account_number' => ['sometimes', 'string', 'max:30'],
            'account_owner' => ['sometimes', 'string', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'bank_name.string' => 'The bank name must be a valid string.',
            'bank_name.max' => 'The bank name may not be longer than 50 characters.',
            'account_number.string' => 'The account number must be a valid string.',
            'account_number.max' => 'The account number may not be longer than 30 characters.',
            'account_owner.string' => 'The account owner name must be a valid string.',
            'account_owner.max' => 'The account owner name may not be longer than 100 characters.',
            'is_active.boolean' => 'The active status must be true or false.',
        ];
    }
}
