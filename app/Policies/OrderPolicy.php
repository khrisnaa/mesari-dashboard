<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class OrderPolicy
{

    public function before(User $user, string $ability): ?bool
    {
        return $user->hasRole('superadmin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, Order $order): bool
    {
        return $user->hasRole('admin')
            || $order->user_id === $user->id;
    }

    public function updateAddress(User $user, Order $order): bool
    {
        return $order->user_id === $user->id
            && $order->status === 'pending';
    }

    public function updateStatus(User $user, Order $order): bool
    {
        return $user->hasRole('admin');
    }


    public function cancel(User $user, Order $order): bool
    {
        return $this->view($user, $order);
    }
}
