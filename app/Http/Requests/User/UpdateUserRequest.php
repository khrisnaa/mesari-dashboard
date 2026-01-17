<?php

namespace App\Http\Requests\User;

use App\Enums\UserStatus;
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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'email'  => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($this->user->id)->whereNull('deleted_at'),
            ],
            'password' => ['nullable', 'string', 'min:8'],
            'status' => ['required', Rule::in(array_column(UserStatus::cases(), 'value'))],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'  => 'Name is required.',
            'name.string'    => 'Name must be a valid string.',
            'name.max'       => 'Name cannot exceed 255 characters.',

            'email.required' => 'Email is required.',
            'email.email'    => 'Email must be a valid email address.',
            'email.unique'   => 'This email is already registered.',

            'password.min'   => 'Password must be at least 8 characters.',

            'status.required' => 'Status is required.',
            'status.in'       => 'Status value is not valid.',
        ];
    }
}
