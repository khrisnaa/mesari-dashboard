<?php

namespace App\Http\Requests\Admin\Order;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
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
            'order_status' => [
                'required',
                Rule::in(array_column(OrderStatus::cases(), 'value')),
            ],

            'payment_status' => [
                'required',
                Rule::in(array_column(PaymentStatus::cases(), 'value')),
            ]
        ];
    }

    public function messages(): array
    {
        return [
            'order_status.required' => 'Order status is required.',
            'order_status.in' => 'Invalid order status value.',

            'payment_status.required' => 'Order payment status is required.',
            'payment_status.in' => 'Invalid order payment status value.',
        ];
    }
}
