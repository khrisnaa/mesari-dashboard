<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'password' => ['required', 'current_password'],
            'new_password' => ['required', 'string', 'min:8', 'max:60', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'password.required' => 'Old password is required.',
            'password.current_password' => 'Old password is incorrect.',
            'new_password.required' => 'New password is required.',
            'new_password.min' => 'New password must be at least 8 characters.',
            'new_password.max' => 'New password is too long.',
            'new_password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
