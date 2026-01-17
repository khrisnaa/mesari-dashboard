<?php

namespace App\Http\Requests\Banner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBannerRequest extends FormRequest
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
            'title'          => ['nullable', 'string', 'max:255'],
            'description'    => ['nullable', 'string', 'max:255'],
            'backdrop_path'  => ['required', 'string', 'max:255'],
            'backdrop_url'   => ['nullable', 'string', 'max:255'],
            'image_path'     => ['required', 'string', 'max:255'],
            'image_url'      => ['nullable', 'string', 'max:255'],
            'cta_text'       => ['nullable', 'string', 'max:255'],
            'cta_link'       => ['nullable', 'string', 'max:255'],
            'sort_order'     => ['nullable', 'integer', 'min:0'],
            'is_active'      => ['required', 'boolean'],
        ];
    }
}
