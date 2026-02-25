<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
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
            // 1. Update status pada tabel Order
            $order->update([
                'order_status' => $data['order_status'],
                'payment_status' => $data['payment_status'],
            ]);

            // 2. Akses relasi hasOne
            $payment = $order->payment;

            if ($payment) {
                $paymentData = [];

                // Handle upload file bukti transfer
                if (isset($data['payment_proof']) && $data['payment_proof'] instanceof \Illuminate\Http\UploadedFile) {
                    // Hapus file lama jika ada untuk menghemat storage
                    if ($payment->payment_proof) {
                        Storage::disk('public')->delete($payment->payment_proof);
                    }

                    $path = $data['payment_proof']->store('payment_proofs', 'public');
                    $paymentData['payment_proof'] = $path;
                }

                // Update catatan admin (admin_note) jika ada
                if (array_key_exists('admin_note', $data)) {
                    $paymentData['admin_note'] = $data['admin_note'];
                }

                // Sinkronisasi status pembayaran ke tabel payment
                $paymentData['transaction_status'] = $data['payment_status'];

                $payment->update($paymentData);
            }

            return true;
        });
    }
}
