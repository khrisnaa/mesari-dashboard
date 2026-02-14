<?php

namespace App\Http\Controllers\Api;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Notification;
use Midtrans\Snap;

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

                if (!$isExpired) {
                    return response()->json([
                        'status' => 'success',
                        'snap_token' => $existingPayment->snap_token,
                        'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v4/redirection/' . $existingPayment->snap_token,
                        'message' => 'Continue previous transaction',
                    ]);
                }

                $existingPayment->update(['transaction_status' => PaymentStatus::FAILED->value]);
            }

            return DB::transaction(function () use ($order) {
                $midtransOrderId = 'TRX-' . $order->id . '-' . now()->timestamp;

                $itemDetails = $order->items
                    ->map(function ($item) {
                        return [
                            'id' => $item->product_variant_id,
                            'price' => (int) $item->price,
                            'quantity' => (int) $item->quantity,
                            'name' => substr($item->product_name . ' - ' . $item->variant_name, 0, 50),
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

                return response()->json([
                    'status' => 'success',
                    'snap_token' => $transaction->token,
                    'redirect_url' => $transaction->redirect_url,
                    'payment' => $payment,
                ]);
            });
        } catch (\Exception $e) {
            Log::error('Payment Store Error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to process payment'], 500);
        }
    }

    public function notification(Request $request)
    {
        try {
            // DB Transaction to ensure data consistency
            return DB::transaction(function () use ($request) {

                // receive notification from midtrans
                $notif = new Notification();
                // $notif = (object) $request->all(); // For Postman Test

                $transaction = $notif->transaction_status;
                $type = $notif->payment_type;
                $orderId = $notif->order_id;
                $fraud = $notif->fraud_status;

                // Fix for Postman: getResponse() only works with Notification object
                $payload = method_exists($notif, 'getResponse') ? $notif->getResponse() : json_encode($request->all());

                // Use lockForUpdate to prevent race conditions from duplicate notifications
                $payment = Payment::where('midtrans_order_id', $orderId)->lockForUpdate()->first();

                if (!$payment) {
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

                // update payment record
                $payment->update([
                    'transaction_status' => $paymentStatus,
                    'midtrans_transaction_id' => $notif->transaction_id,
                    'payment_type' => $type,
                    'fraud_status' => $fraud,
                    'transaction_time' => $notif->transaction_time,
                    'settlement_time' => $notif->settlement_time ?? null,
                    'payload' => $payload,
                ]);

                // update related order status
                $payment->order->update([
                    'order_status' => $orderStatus,
                    'payment_status' => $paymentStatus,
                ]);

                return response()->json(['message' => 'notification processed'], 200);
            });
        } catch (\Exception $e) {
            Log::error('midtrans error: ' . $e->getMessage());

            return response()->json([
                'message' => 'error processing notification',
                'error_detail' => $e->getMessage(),
            ], 500);
        }
    }
}
