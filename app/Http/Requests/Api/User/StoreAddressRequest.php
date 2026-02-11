<?php

namespace App\Http\Requests\Api\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'city_id' => ['required', 'integer', 'exists:cities,id'],
            'recipient_name'   => ['required', 'string', 'max:255'],
            'phone'            => ['required', 'string', 'max:20'],
            'label'            => ['required', 'string'],
            'address_line'     => ['required', 'string'],
            'province_name'    => ['required', 'string'],
            'city_name'        => ['required', 'string'],
            'postal_code'      => ['required', 'string'],
            'is_default'       => ['boolean'],
        ];
    }
}
