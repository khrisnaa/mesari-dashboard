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

            'shipping_tracking_number' => ['nullable', 'string', 'max:100'],
            'shipping_estimation' => ['nullable', 'string', 'max:50'],

            'recipient_name' => ['required', 'string', 'max:255'],
            'recipient_phone' => ['required', 'string', 'max:20'],
            'recipient_address_line' => ['required', 'string'],

            'note' => ['nullable', 'string', 'max:1000'],

            'payment_proof' => ['nullable', 'image', 'max:2048'],
            'admin_note' => ['nullable', 'string', 'max:500'],
        ];
    }
}
