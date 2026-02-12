<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Order\CheckoutRequest;
use App\Http\Requests\Api\Order\DirectCheckoutRequest;
use App\Http\Resources\OrderDetailResource;
use App\Http\Resources\OrderListResource;
use App\Http\Resources\OrderResource;
use App\Services\Api\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    // process checkout from cart
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

    // process checkout directly form product detail
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

    public function index(Request $request)
    {
        $perPage = min($request->integer('per_page', 10), 50);

        $orders = $this->orderService
            ->getOrderHistory($request->user(), $perPage);

        return ApiResponse::success(
            'Order history retrieved',
            OrderListResource::collection($orders),
            200,
            [
                'current_page' => $orders->currentPage(),
                'last_page'    => $orders->lastPage(),
                'per_page'     => $orders->perPage(),
                'total'        => $orders->total(),
                'has_more'     => $orders->hasMorePages(),
            ]
        );
    }


    public function show($id, Request $request)
    {
        $order = $this->orderService->getOrderDetail($request->user(), $id);

        return ApiResponse::success(
            'Order detail retrieved',
            new OrderDetailResource($order)
        );
    }
}
