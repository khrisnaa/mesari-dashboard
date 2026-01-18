<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class UserService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'name',
            'email',
            'created_at',
            'email_verified_at',
            'status',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return User::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(string $id): User
    {
        return User::findOrFail($id);
    }

    public function update(User $user, array $data): bool
    {
        // Don't update password if empty
        if (empty($data['password'])) {
            unset($data['password']);
        }

        return $user->update($data);
    }

    public function updateStatus(User $user, string $status): bool
    {
        // Extra safety: pastikan status valid
        if (! in_array($status, array_column(UserStatus::cases(), 'value'), true)) {
            throw new \InvalidArgumentException('Invalid user status.');
        }

        return $user->update([
            'status' => $status,
        ]);
    }
}
