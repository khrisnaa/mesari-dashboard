<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email'                 => ['required', 'email', 'exists:users,email'],
            'token'                 => ['required', 'string'],
            'password'              => ['required', 'min:8', 'confirmed'],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'Email is required.',
            'email.exists'   => 'Email not found.',

            'token.required' => 'Reset token is required.',

            'password.required'  => 'Password is required.',
            'password.min'       => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
