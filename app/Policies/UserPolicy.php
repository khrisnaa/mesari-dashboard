<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

class UserPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->hasRole('superadmin') ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasRole('admin')
            || $user->id === $model->id;
    }

    public function update(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function updateProfile(User $user, User $model): bool
    {
        return $user->id === $model->id;
    }

    public function updateStatus(User $user): bool
    {
        return $user->hasRole('admin');
    }
}
