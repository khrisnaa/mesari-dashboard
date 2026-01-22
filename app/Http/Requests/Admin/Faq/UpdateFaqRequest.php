<?php

namespace App\Http\Requests\Faq\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFaqRequest extends FormRequest
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
            'question'      => ['required', 'string', 'max:255'],
            'answer'        => ['required', 'string'],
            'sort_order'    => ['nullable', 'integer', 'min:0'],
            'is_published'  => ['required', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'question.required'     => 'Question is required.',
            'question.string'       => 'Question must be a valid string.',
            'question.max'          => 'Question cannot exceed 255 characters.',

            'answer.required'       => 'Answer is required.',
            'answer.string'         => 'Answer must be a valid string.',

            'sort_order.integer'    => 'Sort order must be an integer.',
            'sort_order.min'        => 'Sort order cannot be negative.',

            'is_published.required' => 'Publish status is required.',
            'is_published.boolean'  => 'Publish status must be a boolean value.',
        ];
    }
}
