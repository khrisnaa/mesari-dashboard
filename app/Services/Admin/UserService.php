<?php

namespace App\Services\Admin;

use App\Models\User;
use App\Notifications\AdminInvitationNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class UserService
{
    // paginate users with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'name',
            'email',
            'created_at',
            'email_verified_at',
            'is_active',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return User::query()
            ->with('roles')
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    // update user detail
    public function update(User $user, array $data): bool
    {

        if (array_key_exists('email_verified_at', $data)) {

            if ($data['email_verified_at']) {
                $data['email_verified_at'] = $user->email_verified_at ?? now();
            } else {
                $data['email_verified_at'] = null;
            }
        }

        return $user->update($data);
    }

    // update user status only
    public function updateStatus(User $user, bool $status): bool
    {
        return $user->update([
            'is_active' => $status,
        ]);
    }

    public function inviteAdmin(array $data): User
    {

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make(Str::random(40)),
            'email_verified_at' => now(),
        ]);

        $user->assignRole('admin');
        $token = Password::createToken($user);
        $user->notify(new AdminInvitationNotification($token));

        return $user;
    }
}
