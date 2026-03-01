<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.string' => 'The name must be a valid string.',
            'name.max' => 'The name may not be longer than 255 characters.',

            'phone.string' => 'The phone number must be a valid string.',
            'phone.max' => 'The phone number may not be longer than 20 characters.',

            'avatar.image' => 'The avatar must be an image file.',
            'avatar.max' => 'The avatar may not be larger than 2MB.',
        ];
    }
}
