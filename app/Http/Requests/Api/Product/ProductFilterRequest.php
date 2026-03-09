<?php

namespace App\Http\Requests\Api\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductFilterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'category_id' => ['nullable', 'uuid'],
            'min_price' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'max_price' => ['nullable', 'numeric', 'min:0', 'max:9999999999.99'],
            'sort' => ['nullable', 'in:newest,price_asc,price_desc'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'is_customizable' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'search.string' => 'The search keyword must be a valid string.',
            'search.max' => 'The search keyword may not be longer than 100 characters.',

            'category_id.uuid' => 'The category ID must be a valid UUID.',

            'min_price.numeric' => 'The minimum price must be a number.',
            'min_price.min' => 'The minimum price must be at least 0.',
            'min_price.max' => 'The minimum price exceeds the maximum limit.',

            'max_price.numeric' => 'The maximum price must be a number.',
            'max_price.min' => 'The maximum price must be at least 0.',
            'max_price.max' => 'The maximum price exceeds the maximum limit.',

            'sort.in' => 'The sort option is invalid.',

            'per_page.integer' => 'The per page value must be an integer.',
            'per_page.min' => 'The per page value must be at least 1.',
            'per_page.max' => 'The per page value may not be greater than 100.',

            'is_customizable.boolean' => 'The customizable flag must be true or false.',
        ];
    }
}
