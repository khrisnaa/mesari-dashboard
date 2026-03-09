<?php

namespace App\Http\Requests\Admin\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_status' => ['required', Rule::in(array_column(OrderStatus::cases(), 'value'))],
            'payment_status' => ['required', Rule::in(array_column(PaymentStatus::cases(), 'value'))],

            'shipping_tracking_number' => ['nullable', 'string', 'max:50'],
            'shipping_estimation' => ['nullable', 'string', 'max:50'],

            'recipient_name' => ['required', 'string', 'max:100'],
            'recipient_phone' => ['required', 'string', 'max:20'],
            'recipient_address_line' => ['required', 'string'],

            'note' => ['nullable', 'string', 'max:1000'],

            'payment_proof' => ['nullable', 'image', 'max:2048'],
            'admin_note' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'order_status.required' => 'Order status is required.',
            'order_status.in' => 'The selected order status is invalid.',

            'payment_status.required' => 'Payment status is required.',
            'payment_status.in' => 'The selected payment status is invalid.',

            'shipping_tracking_number.string' => 'Tracking number must be a valid string.',
            'shipping_tracking_number.max' => 'Tracking number cannot exceed 50 characters.',

            'shipping_estimation.string' => 'Shipping estimation must be a valid string.',
            'shipping_estimation.max' => 'Shipping estimation cannot exceed 50 characters.',

            'recipient_name.required' => 'Recipient name is required.',
            'recipient_name.string' => 'Recipient name must be a valid string.',
            'recipient_name.max' => 'Recipient name cannot exceed 100 characters.',

            'recipient_phone.required' => 'Recipient phone number is required.',
            'recipient_phone.string' => 'Recipient phone number must be a valid string.',
            'recipient_phone.max' => 'Recipient phone number cannot exceed 20 characters.',

            'recipient_address_line.required' => 'Complete address is required.',
            'recipient_address_line.string' => 'Address must be a valid string.',

            'note.string' => 'Note must be a valid string.',
            'note.max' => 'Note cannot exceed 1000 characters.',

            'payment_proof.image' => 'Payment proof must be an image file.',
            'payment_proof.max' => 'Payment proof file size cannot exceed 2MB.',

            'admin_note.string' => 'Admin note must be a valid string.',
            'admin_note.max' => 'Admin note cannot exceed 500 characters.',
        ];
    }
}
