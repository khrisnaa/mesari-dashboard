<?php

namespace App\Services\Admin;

use App\Models\PaymentMethod;
use Illuminate\Pagination\LengthAwarePaginator;

class PaymentMethodService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        return PaymentMethod::query()
            ->when($params['search'] ?? null, fn ($q, $s) => $q->where('bank_name', 'like', "%$s%")->orWhere('account_owner', 'like', "%$s%"))
            ->orderBy($params['sort'] ?? 'created_at', $params['direction'] ?? 'desc')
            ->paginate($params['per_page'] ?? 10)
            ->withQueryString();
    }

    public function store(array $data): PaymentMethod
    {
        return PaymentMethod::create($data);
    }

    public function update(PaymentMethod $paymentMethod, array $data): bool
    {

        return $paymentMethod->update($data);
    }

    public function delete(PaymentMethod $paymentMethod): bool
    {
        return $paymentMethod->delete();
    }
}
