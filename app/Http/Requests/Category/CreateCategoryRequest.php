<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCategoryRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', Rule::unique('categories', 'name')->whereNull('deleted_at')],
            'description' => ['nullable', 'string', 'max:1000'],
            'parent_id' => ['nullable', 'uuid', 'exists:categories,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a valid string.',
            'name.max' => 'Category name cannot exceed 255 characters.',
            'name.unique' => 'This category name is already taken.',

            'description.string' => 'Description must be a valid text.',
            'description.max' => 'Description cannot exceed 1000 characters.',

            'parent_id.uuid' => 'Parent category ID must be a valid UUID.',
            'parent_id.exists' => 'Selected parent category does not exist.',
        ];
    }
}
