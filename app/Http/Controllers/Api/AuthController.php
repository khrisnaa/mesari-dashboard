<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\ForgotPasswordRequest;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Http\Requests\Api\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $user->sendEmailVerificationNotification();

        return ApiResponse::success(
            'Account created successfully. Please verify your email.',
            new UserResource($user),
            201,
            ['must_verify_email' => true]
        );
    }

    public function login(LoginRequest $request)
    {
        config(['auth.defaults.guard' => 'web']);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if (! $user->hasVerifiedEmail()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return ApiResponse::error('Please verify your email first.', null, 403);
            }

            $request->session()->regenerate();

            return ApiResponse::success(
                'Login successful.',
                new UserResource($user),
            );
        }

        return ApiResponse::error('Invalid credentials', null, 401);
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::error('Email already verified.', null, 400);
        }

        $user->sendEmailVerificationNotification();

        return ApiResponse::success('Verification email sent.');
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (! hash_equals((string) $request->route('hash'), sha1($user->email))) {
            return redirect(env('FRONTEND_URL').'/verify/error');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect(env('FRONTEND_URL').'/login?verified=1');
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return ApiResponse::success('Logout successful.');
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return ApiResponse::error('Email not found.', null, 404);
        }

        if (! $user->hasVerifiedEmail()) {
            return ApiResponse::error(
                'Your email address is not verified. Please verify your email before resetting password.',
                null,
                403
            );
        }

        $tokenRepo = app('auth.password.broker')->getRepository();
        $token = $tokenRepo->create($user);

        $user->sendPasswordResetNotification($token);

        return ApiResponse::success('Password reset email sent.');
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return ApiResponse::success('Password reset successful.');
        }

        return ApiResponse::error('Invalid token or email.', null, 400);
    }
}
