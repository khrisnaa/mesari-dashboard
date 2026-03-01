<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentMethod\UpdatePaymentMethodRequest;
use App\Models\PaymentMethod;
use App\Services\Admin\PaymentMethodService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentMethodController extends Controller
{
    public function __construct(protected PaymentMethodService $service) {}

    public function index(Request $request)
    {
        return Inertia::render('payment-methods/index', [
            'methods' => $this->service->paginate($request->all()),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'bank_name' => 'required|string',
            'account_number' => 'required|string',
            'account_owner' => 'required|string',
            'is_active' => 'boolean',
        ]);
        $this->service->store($data);

        return back()->with('success', 'Payment method created.');
    }

    public function update(UpdatePaymentMethodRequest $request, PaymentMethod $paymentMethod)
    {

        $this->service->update($paymentMethod, $request->validated());

        return back()->with('success', 'Payment method updated.');
    }

    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->service->delete($paymentMethod);

        return back()->with('success', 'Payment method deleted.');
    }
}
