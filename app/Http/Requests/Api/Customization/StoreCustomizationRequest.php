<?php

namespace App\Http\Requests\Api\Customization;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'uuid', 'exists:products,id'],
            'product_variant_id' => ['required', 'uuid', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'total_custom_sides' => ['required', 'integer', 'min:0', 'max:4'],
            'custom_details' => ['required', 'array'],
            'custom_details.*.has_design' => ['required', 'boolean'],
            'custom_details.*.mockup_image_base64' => ['exclude_if:custom_details.*.has_design,false', 'required', 'string'],
            'custom_details.*.design_data' => ['nullable', 'array'],
        ];
    }
}
