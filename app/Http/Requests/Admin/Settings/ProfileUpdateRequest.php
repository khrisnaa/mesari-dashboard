<?php

namespace App\Http\Requests\Admin\Settings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],

            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:50',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name cannot exceed 100 characters.',

            'email.required' => 'Email address is required.',
            'email.string' => 'Email address must be a valid string.',
            'email.lowercase' => 'Email address must be in lowercase.',
            'email.email' => 'Please provide a valid email address.',
            'email.max' => 'Email address cannot exceed 50 characters.',
            'email.unique' => 'This email address is already registered.',
        ];
    }
}
