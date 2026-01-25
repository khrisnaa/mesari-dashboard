<?php

namespace App\Services\Api;

use App\Models\UserAddress;

class UserAddressService
{
    public function list($userId)
    {
        return UserAddress::where('user_id', $userId)->get();
    }

    public function store($userId, array $data)
    {
        // jika default = true → reset other default
        if (!empty($data['is_default']) && $data['is_default'] == true) {
            UserAddress::where('user_id', $userId)
                ->update(['is_default' => false]);
        }

        return UserAddress::create([
            ...$data,
            'user_id' => $userId,
        ]);
    }

    public function update(UserAddress $address, array $data)
    {
        if (isset($data['is_default']) && $data['is_default'] == true) {
            UserAddress::where('user_id', $address->user_id)
                ->update(['is_default' => false]);
        }

        $address->update($data);

        return $address;
    }

    public function delete(UserAddress $address)
    {
        $address->delete();
    }
}
