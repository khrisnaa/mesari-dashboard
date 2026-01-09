<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Auth\Access\Response;

class UserAddressPolicy
{
    public function manage(User $user, UserAddress $address): bool
    {
        return $address->user_id === $user->id;
    }
}
