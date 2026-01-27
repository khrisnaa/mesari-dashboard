<?php

namespace App\Services\Api;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class UserService
{
    // update user detail
    public function update(User $user, array $data)
    {
        // fill normal attributes
        $user->fill([
            'name'  => $data['name'] ?? $user->name,
            'phone' => $data['phone'] ?? $user->phone,
        ]);

        // handle avatar if present
        if (isset($data['avatar']) && $data['avatar'] instanceof UploadedFile) {
            $avatarPath = $data['avatar']->store('avatars', 'public');
            $user->avatar = $avatarPath;
        }

        $user->save();

        return $user;
    }

    // update user password
    public function updatePassword(User $user, string $newPassword): User
    {
        $user->password = Hash::make($newPassword);
        $user->save();

        return $user;
    }
}
