<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Payment\ManualPaymentRequest;
use App\Http\Resources\PaymentMethodResource;
use App\Models\Order;
use App\Models\Payment;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;
use Midtrans\Transaction;

class PaymentController extends Controller
{
    public function __construct()
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
            $order = Order::with(['user', 'items.variant.product'])
                ->lockForUpdate()
                ->findOrFail($request->order_id);

            $existingPayment = Payment::where('order_id', $order->id)
                ->where('transaction_status', PaymentStatus::PENDING->value)->first();

            if ($existingPayment) {
                $isExpired = $existingPayment->created_at->diffInHours(now()) >= 23;

                if (! $isExpired) {
                    return ApiResponse::success('Continue previous transaction', [
                        'snap_token' => $existingPayment->snap_token,
                        'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v4/redirection/'.$existingPayment->snap_token,
                    ]);
                }

                $existingPayment->update(['transaction_status' => PaymentStatus::FAILED->value]);
            }

            return DB::transaction(function () use ($order) {
                $midtransOrderId = 'TRX-'.explode('-', $order->id)[0].'-'.now()->timestamp;

                $itemDetails = $order->items
                    ->map(function ($item) {
                        return [
                            'id' => $item->product_variant_id,
                            'price' => (int) $item->price,
                            'quantity' => (int) $item->quantity,
                            'name' => substr($item->product_name.' - '.$item->variant_name, 0, 50),
                        ];
                    })
                    ->toArray();

                if ($order->shipping_cost > 0) {
                    $itemDetails[] = [
                        'id' => 'SHIPPING-FEE',
                        'price' => (int) $order->shipping_cost,
                        'quantity' => 1,
                        'name' => 'Shipping Cost',
                    ];
                }

                $params = [
                    'transaction_details' => [
                        'order_id' => $midtransOrderId,
                        'gross_amount' => (int) $order->grand_total,
                    ],
                    'customer_details' => [
                        'first_name' => $order->user->name,
                        'phone' => $order->user->phone,
                        'billing_address' => [
                            'address' => $order->recipient_address_line,
                            'city' => $order->recipient_city,
                            'postal_code' => $order->postal_code,
                            'country_code' => 'IDN',
                        ],
                    ],
                    'item_details' => $itemDetails,
                ];

                $transaction = Snap::createTransaction($params);

                $payment = Payment::create([
                    'order_id' => $order->id,
                    'midtrans_order_id' => $midtransOrderId,
                    'midtrans_transaction_id' => null,
                    'snap_token' => $transaction->token,
                    'gross_amount' => $order->grand_total,
                    'transaction_status' => PaymentStatus::PENDING->value,
                ]);

                return ApiResponse::success('Payment initiated successfully', [
                    'snap_token' => $transaction->token,
                    'redirect_url' => $transaction->redirect_url,
                    'payment' => $payment,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Payment Store Error: '.$e->getMessage());

            return ApiResponse::error('Failed to process payment', $e->getMessage(), 500);
        }
    }

    public function notification(Request $request)
    {
        Log::info('--- INCOMING MIDTRANS WEBHOOK ---');
        Log::info('Payload Midtrans: ', $request->all() ?? []);

        if (! $request->isMethod('post') || empty($request->all())) {
            Log::warning('Webhook declined: Method is not POST or Payload is empty');

            return response()->json(['message' => 'Invalid request'], 400);
        }

        try {
            $notif = new Notification;
            Log::info('Successfully created instance Midtrans Notification');

            $transaction = $notif->transaction_status;
            $type = $notif->payment_type;
            $orderId = $notif->order_id;
            $fraud = $notif->fraud_status;

            Log::info("Data -> OrderID: {$orderId}, Status: {$transaction}");

            return DB::transaction(function () use ($notif, $transaction, $type, $orderId, $fraud, $request) {

                // $payload = method_exists($notif, 'getResponse') ? $notif->getResponse() : json_encode($request->all());
                $payload = json_encode($request->all());

                $payment = Payment::where('midtrans_order_id', $orderId)->lockForUpdate()->first();

                if (! $payment) {
                    Log::error("FAILED: Payment with midtrans_order_id '{$orderId}' NOT FOUND in database!");

                    return response()->json(['message' => 'payment not found'], 404);
                }

                $paymentStatus = PaymentStatus::PENDING->value;
                $orderStatus = OrderStatus::PENDING->value;

                if ($transaction == 'capture') {
                    if ($type == 'credit_card') {
                        if ($fraud == 'challenge') {
                            $paymentStatus = PaymentStatus::PENDING->value;
                            $orderStatus = OrderStatus::PENDING->value;
                        } else {
                            $paymentStatus = PaymentStatus::PAID->value;
                            $orderStatus = OrderStatus::PAID->value;
                        }
                    }
                } elseif ($transaction == 'settlement') {
                    $paymentStatus = PaymentStatus::PAID->value;
                    $orderStatus = OrderStatus::PAID->value;
                } elseif ($transaction == 'pending') {
                    $paymentStatus = PaymentStatus::PENDING->value;
                    $orderStatus = OrderStatus::PENDING->value;
                } elseif (in_array($transaction, ['deny', 'expire', 'cancel'])) {
                    $paymentStatus = PaymentStatus::FAILED->value;
                    $orderStatus = OrderStatus::CANCELLED->value;
                }

                Log::info("Update DB -> Payment Status: {$paymentStatus}, Order Status: {$orderStatus}");

                $payment->update([
                    'transaction_status' => $paymentStatus,
                    // 'midtrans_transaction_id' => $notif->transaction_id,
                    'midtrans_transaction_id' => $request->transaction_id,
                    'payment_type' => $type,
                    'fraud_status' => $fraud,
                    'transaction_time' => $notif->transaction_time,
                    'settlement_time' => $notif->settlement_time ?? null,
                    'payload' => $payload,
                ]);

                $payment->order->update([
                    'order_status' => $orderStatus,
                    'payment_status' => $paymentStatus,
                ]);

                Log::info("SUKSES: Webhook selesai diproses untuk OrderID: {$orderId}");

                return response()->json(['message' => 'notification processed'], 200);
            });
        } catch (\Exception $e) {
            Log::error('MIDTRANS WEBHOOK ERROR: '.$e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'message' => 'error processing notification',
                'error_detail' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkStatus($id)
    {
        try {

            $payment = Payment::where('order_id', $id)
                ->orWhere('midtrans_order_id', $id)
                ->firstOrFail();

            $status = (object) Transaction::status($payment->midtrans_order_id);

            $midtransStatus = $status->transaction_status;
            $paymentStatus = $payment->transaction_status;

            if ($paymentStatus !== PaymentStatus::PAID->value &&
               ($midtransStatus === 'settlement' || $midtransStatus === 'capture')) {

                DB::transaction(function () use ($payment, $status) {

                    $payment->update([
                        'transaction_status' => PaymentStatus::PAID->value,
                        'midtrans_transaction_id' => $status->transaction_id,
                        'payload' => json_encode($status),
                    ]);

                    $payment->order->update([
                        'order_status' => OrderStatus::PAID->value,
                        'payment_status' => PaymentStatus::PAID->value,
                    ]);
                });

                return ApiResponse::success('Payment status synchronized successfully', [
                    'current_status' => 'paid',
                ]);
            }

            return ApiResponse::success('Status is up to date', [
                'current_status' => $paymentStatus,
            ]);

        } catch (\Exception $e) {
            Log::error('Check Status Error: '.$e->getMessage());

            return ApiResponse::error('Transaction not found or connection failed', $e->getMessage(), 404);
        }
    }

    public function getMethods()
    {
        $methods = PaymentMethod::where('is_active', true)->get();

        return ApiResponse::success('Payment methods retrieved', PaymentMethodResource::collection($methods));
    }

    public function storeManual(ManualPaymentRequest $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $order = Order::findOrFail($request->order_id);
                $method = PaymentMethod::findOrFail($request->payment_method_id);

                $paymentStatus = $request->hasFile('payment_proof')
                    ? PaymentStatus::WAITING_APPROVAL->value
                    : PaymentStatus::PENDING->value;

                $orderStatus = $request->hasFile('payment_proof')
                    ? OrderStatus::WAITING_APPROVAL->value
                    : OrderStatus::PENDING->value;

                $payment = Payment::updateOrCreate(
                    ['order_id' => $order->id],
                    [
                        'payment_method_info' => "{$method->bank_name} - {$method->account_number}",
                        'payment_type' => 'manual',
                        'gross_amount' => $order->grand_total,
                        'transaction_status' => $paymentStatus,
                        'payload' => json_encode([
                            'bank' => $method->bank_name,
                            'number' => $method->account_number,
                            'holder' => $method->account_owner,
                        ]),
                    ]
                );

                if ($request->hasFile('payment_proof')) {

                    if ($payment->payment_proof) {
                        Storage::disk('public')->delete($payment->payment_proof);
                    }

                    $path = $request->file('payment_proof')->store('payment_proofs', 'public');
                    $payment->update(['payment_proof' => $path]);
                }

                $order->update([
                    'payment_status' => $paymentStatus,
                    'order_status' => $orderStatus,
                ]);

                return ApiResponse::success('Manual payment proof submitted successfully', $payment);
            });
        } catch (\Exception $e) {
            return ApiResponse::error('Failed to process manual payment', $e->getMessage());
        }
    }
}
