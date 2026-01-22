<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
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

    public function show(string $id)
    {
        $order = $this->orderService->find($id);

        return Inertia::render('orders/show', [
            'order' => $order,
        ]);
    }

    public function edit(Order $order)
    {
        return Inertia::render('orders/edit', [
            'order' => $order,
        ]);
    }

    public function update(UpdateOrderStatusRequest $request, Order $order)
    {
        $this->orderService->updateStatus($order, $request->validated());

        return redirect()->route('orders.index')
            ->with('success', 'Order status successfully updated.');
    }
}
