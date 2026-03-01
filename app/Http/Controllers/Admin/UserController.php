<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\FlashHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\InviteAdminRequest;
use App\Http\Requests\Admin\User\UpdateUserRequest;
use App\Http\Requests\Admin\User\UpdateUserStatusRequest;
use App\Models\User;
use App\Services\Admin\UserService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(Request $request)
    {
        return Inertia::render('users/index', [
            'users' => $this->userService->paginate($request->all()),
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {

        $this->userService->update($user, $request->validated());

        return redirect()->route('users.index')
            ->with('success', FlashHelper::stamp('User successfully updated.'));
    }

    // update user status only
    public function updateStatus(UpdateUserStatusRequest $request, User $user)
    {
        $this->userService->updateStatus($user, $request->validated('is_active'));

        return redirect()->back()
            ->with('success', FlashHelper::stamp('User status successfully updated.'));
    }

    public function invite(InviteAdminRequest $request)
    {
        $this->userService->inviteAdmin($request->validated());

        return redirect()->route('users.index')
            ->with('success', FlashHelper::stamp('Admin invitation has been sent successfully.'));
    }
}
