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
            'custom_details.*.mockup_image_base64' => ['required', 'string'],
            'custom_details.*.design_data' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'product_id.required' => 'The product ID is required.',
            'product_id.uuid' => 'The product ID must be a valid UUID.',
            'product_id.exists' => 'The selected product does not exist.',

            'product_variant_id.required' => 'The product variant ID is required.',
            'product_variant_id.uuid' => 'The product variant ID must be a valid UUID.',
            'product_variant_id.exists' => 'The selected product variant does not exist.',

            'quantity.required' => 'The quantity is required.',
            'quantity.integer' => 'The quantity must be an integer.',
            'quantity.min' => 'The quantity must be at least 1.',

            'total_custom_sides.required' => 'The total number of custom sides is required.',
            'total_custom_sides.integer' => 'The total custom sides must be an integer.',
            'total_custom_sides.min' => 'The total custom sides must be at least 0.',
            'total_custom_sides.max' => 'The total custom sides may not be greater than 4.',

            'custom_details.required' => 'The custom details field is required.',
            'custom_details.array' => 'The custom details must be an array.',

            'custom_details.*.has_design.required' => 'The has_design field is required for each custom detail.',
            'custom_details.*.has_design.boolean' => 'The has_design field must be a boolean value.',

            'custom_details.*.mockup_image_base64.required' => 'The mockup image is required when a design is present.',
            'custom_details.*.mockup_image_base64.string' => 'The mockup image must be a valid base64 string.',

            'custom_details.*.design_data.array' => 'The design data must be an array.',
        ];
    }
}
