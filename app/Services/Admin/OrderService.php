<?php

namespace App\Services\Admin;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'created_at',
            'status',
            'payment_status',
            'user_name',
        ])
            ? $params['sort']
            : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        $query = Order::query()
            ->with(['user', 'items', 'address']);

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

    public function find(string $id): Order
    {
        return Order::with(['items', 'address', 'user'])->findOrFail($id);
    }

    public function updateStatus(Order $order, array $data): bool
    {
        return $order->update([
            'status' => $data['status'],
            'payment_status' => $data['payment_status']
        ]);
    }
}
