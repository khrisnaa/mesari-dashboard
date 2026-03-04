<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Payment\ManualPaymentRequest;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Services\Api\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $paymentService)
    {
        Config::$serverKey = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        try {
            $result = $this->paymentService->createOrContinuePayment(
                $request->order_id
            );

            if ($result['continue']) {
                return ApiResponse::success('Continue previous transaction', [
                    'snap_token' => $result['snap_token'],
                    'redirect_url' => $result['redirect_url'],
                ]);
            }

            return ApiResponse::success('Payment initiated successfully', [
                'snap_token' => $result['snap_token'],
                'redirect_url' => $result['redirect_url'],
                'payment' => $result['payment'],
            ]);

        } catch (\Exception $e) {
            Log::error('Payment Store Error: '.$e->getMessage());

            return ApiResponse::error('Failed to process payment', $e->getMessage(), 500);
        }
    }

    public function notification(Request $request)
    {
        if (! $request->isMethod('post') || empty($request->all())) {
            Log::warning('Webhook declined: method not POST or payload empty.');

            return response()->json(['message' => 'Invalid request'], 400);
        }

        try {
            $result = $this->paymentService->process($request->all());

            return response()->json(
                $result['response'],
                $result['status']
            );

        } catch (\Exception $e) {
            Log::error("MIDTRANS WEBHOOK ERROR: {$e->getMessage()}");
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'error processing notification',
                'error_detail' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkStatus($id)
    {
        $result = $this->paymentService->checkStatus($id);

        if (! $result['success']) {
            return ApiResponse::error(
                $result['message'],
                $result['error'],
                404
            );
        }

        return ApiResponse::success(
            $result['message'],
            $result['data']
        );
    }

    public function getMethods()
    {
        $methods = PaymentMethod::where('is_active', true)->get();

        return ApiResponse::success('Payment methods retrieved', PaymentMethodResource::collection($methods));
    }

    public function storeManual(ManualPaymentRequest $request)
    {
        $result = $this->paymentService->storeManual($request);

        if (! $result['success']) {
            return ApiResponse::error(
                $result['message'],
                $result['error'],
            );
        }

        return ApiResponse::success(
            $result['message'],
            $result['data']
        );
    }
}
