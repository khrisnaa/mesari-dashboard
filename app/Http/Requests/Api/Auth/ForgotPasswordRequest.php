<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => ['required', 'email', 'exists:users,email'],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'Email is required.',
            'email.email'    => 'Please enter a valid email address.',
            'email.exists'   => 'Email not found.',
        ];
    }
}
