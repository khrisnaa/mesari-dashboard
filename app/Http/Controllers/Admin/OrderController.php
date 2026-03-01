<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Order\UpdateOrderRequest as OrderUpdateOrderRequest;
use App\Http\Requests\Admin\Order\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Services\Admin\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('orders/index', [
            'orders' => $this->orderService->paginate($request->all()),
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function show(Order $order)
    {
        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order)
    {
        $this->orderService->updateStatus($order, $request->validated());

        return redirect()->back()
            ->with('success', 'Order status successfully updated.');
    }

    public function edit(Order $order)
    {

        $order->load(['user', 'items', 'payment']);

        return Inertia::render('orders/edit', [
            'order' => $order,
        ]);
    }

    public function update(OrderUpdateOrderRequest $request, Order $order)
    {

        $this->orderService->update($order, $request->validated());

        return redirect()->route('orders.index')
            ->with('success', "Order #{$order->order_number} updated successfully.");
    }
}
