<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],

            'email' => [
                'required',
                'email',
                'max:50',
                Rule::unique('users', 'email')->ignore($this->user->id),
            ],

            'phone' => [
                'nullable',
                'string',
                'max:20',
            ],

            'is_active' => ['required', 'boolean'],

            'email_verified_at' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name cannot exceed 100 characters.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.max' => 'Email cannot exceed 50 characters.',
            'email.unique' => 'This email is already registered.',
            'phone.max' => 'Phone cannot exceed 20 characters.',
            'is_active.required' => 'Active status is required.',
            'is_active.in' => 'Active status value is not valid.',
        ];
    }
}
