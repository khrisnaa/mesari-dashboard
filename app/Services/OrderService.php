<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrderService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', ['created_at', 'status'])
            ? $params['sort']
            : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Order::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('id', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(string $id): Order
    {
        return Order::with(['items', 'address', 'user'])->findOrFail($id);
    }

    public function updateStatus(Order $order, string $status): bool
    {
        return $order->update(['status' => $status]);
    }
}
