<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Order\CheckoutRequest;
use App\Http\Requests\Api\Order\DirectCheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Services\Api\OrderService;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function checkout(CheckoutRequest $request)
    {
        $order = $this->orderService->checkout(
            Auth::user(),
            $request->validated()
        );

        return ApiResponse::success(
            'Checkout successful',
            new OrderResource($order)
        );
    }

    public function directCheckout(DirectCheckoutRequest $request)
    {
        $order = $this->orderService->directCheckout(
            Auth::user(),
            $request->validated()
        );

        return ApiResponse::success(
            'Checkout successful',
            new OrderResource($order)
        );
    }
}
