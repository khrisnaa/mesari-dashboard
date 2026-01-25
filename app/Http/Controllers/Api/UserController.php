<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\UpdatePasswordRequest;
use App\Http\Requests\Api\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\Api\UserService;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function __construct(
        protected UserService $userService
    ) {}

    public function edit()
    {
        $user = Auth::user();

        return ApiResponse::success(
            'User detail fetched successfully',
            new UserResource($user)
        );
    }

    public function update(UpdateUserRequest $request)
    {
        $user = Auth::user();

        $updatedUser = $this->userService->update($user, $request->validated());

        return ApiResponse::success(
            'User updated successfully',
            new UserResource($updatedUser)
        );
    }

    public function updatePassword(UpdatePasswordRequest $request)
    {
        $user = Auth::user();

        $updatedUser = $this->userService
            ->updatePassword($user, $request->new_password);

        return ApiResponse::success(
            'Password updated successfully',
            new UserResource($updatedUser)
        );
    }
}
