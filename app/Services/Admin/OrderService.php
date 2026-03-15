<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class OrderService
{
    // paginate orders with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'created_at',
            'order_status',
            'payment_status',
            'user_name',
        ])
            ? $params['sort']
            : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        $query = Order::query()
            ->with(['user', 'items']);

        $query->when($params['search'] ?? null, function ($q, $search) {
            $q->where('id', 'like', "%{$search}%")
                ->orWhereHas('user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                });
        });

        if ($sort === 'user_name') {
            $query->leftJoin('users', 'users.id', '=', 'orders.user_id')
                ->select('orders.*')
                ->orderBy('users.name', $direction);
        } else {
            $query->orderBy($sort, $direction);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    // update order status or payment status
    // public function updateStatus(Order $order, array $data): bool
    // {
    //     return $order->update([
    //         'order_status' => $data['order_status'],
    //         'payment_status' => $data['payment_status']
    //     ]);
    // }

    public function updateStatus(Order $order, array $data): bool
    {
        return DB::transaction(function () use ($order, $data) {
            $oldStatus = $order->order_status;
            $newStatus = $data['order_status'];

            $order->update([
                'order_status' => $data['order_status'],
                'payment_status' => $data['payment_status'],
            ]);

            if ($oldStatus !== 'cancelled' && $newStatus === 'cancelled') {
                $this->restoreStock($order);
            }

            $payment = $order->payment;

            if ($payment) {
                $paymentData = [];

                if (isset($data['payment_proof']) && $data['payment_proof'] instanceof \Illuminate\Http\UploadedFile) {

                    if ($payment->payment_proof) {
                        Storage::disk('public')->delete($payment->payment_proof);
                    }

                    $path = $data['payment_proof']->store('payment_proofs', 'public');
                    $paymentData['payment_proof'] = $path;
                }

                if (array_key_exists('admin_note', $data)) {
                    $paymentData['admin_note'] = $data['admin_note'];
                }

                $paymentData['transaction_status'] = $data['payment_status'];

                $payment->update($paymentData);
            }

            return true;
        });
    }

    public function update(Order $order, array $data): bool
    {
        return DB::transaction(function () use ($order, $data) {
            $oldStatus = $order->order_status;
            $newStatus = $data['order_status'] ?? $oldStatus;

            $paymentProofPath = $order->payment?->payment_proof;

            if (isset($data['payment_proof']) && $data['payment_proof'] instanceof UploadedFile) {

                if ($paymentProofPath) {
                    Storage::disk('public')->delete($paymentProofPath);
                }

                $paymentProofPath = $data['payment_proof']->store('payment_proofs', 'public');
            }

            if ($order->payment) {
                $order->payment->update([
                    'transaction_status' => $data['payment_status'],
                    'payment_proof' => $paymentProofPath,
                    'admin_note' => $data['admin_note'] ?? $order->payment->admin_note,
                    'payment_method_info' => $data['payment_method_info'] ?? $order->payment->payment_method_info,
                ]);
            }

            $orderData = collect($data)->only([
                'order_status',
                'payment_status',
                'shipping_tracking_number',
                'shipping_estimation',
                'recipient_name',
                'recipient_phone',
                'recipient_address_line',
                'recipient_province',
                'recipient_city',
                'recipient_district',
                'recipient_subdistrict',
                'postal_code',
                'note',
            ])->toArray();

            $updated = $order->update($orderData);

            if ($oldStatus !== 'cancelled' && $newStatus === 'cancelled') {
                $this->restoreStock($order);
            }

            if ($oldStatus === 'cancelled' && $newStatus !== 'cancelled') {
                $this->reduceStock($order);
            }

            return $updated;
        });
    }

    private function restoreStock(Order $order)
    {
        foreach ($order->items as $item) {
            if ($item->variant) {
                $item->variant->increment('stock', $item->quantity);
            }
        }
    }

    private function reduceStock(Order $order)
    {
        foreach ($order->items as $item) {
            if ($item->variant) {
                $item->variant->decrement('stock', $item->quantity);
            }
        }
    }
}
