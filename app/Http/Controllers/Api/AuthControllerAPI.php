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
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
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
            [
                'user' => new UserResource($user),
                'must_verify_email' => true,
            ],
            201
        );
    }

    public function login(LoginRequest $request)
    {

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::error('Invalid credentials', null, 401);
        }

        // verification check
        if (! $user->hasVerifiedEmail()) {
            return ApiResponse::error('Please verify your email first.', null, 403);
        }

        // reset old token
        $user->tokens()->delete();

        // create new token
        $token = $user->createToken($request->userAgent() ?? 'api_token')->plainTextToken;

        return ApiResponse::success(
            'Login successful.',
            [
                'user' => new UserResource($user),
                'token' => $token,
            ]
        );
    }

    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        // check email if has verified or not
        if ($user->hasVerifiedEmail()) {
            return ApiResponse::error('Email already verified.', 400);
        }

        // send notification
        $user->sendEmailVerificationNotification();

        return ApiResponse::success('Verification email sent.');
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        // verify the hash to ensure link integrity (prevents tampering)
        if (! hash_equals(
            (string) $request->route('hash'),
            sha1($user->email)
        )) {
            return redirect(env('FRONTEND_URL').'/verify/error');
        }

        // mark email as verified if not already verified
        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect(env('FRONTEND_URL').'/login?verified=1');
    }

    public function logout(Request $request)
    {
        // delete token
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success('Logout successful.');
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return ApiResponse::error('Email not found.', null, 404);
        }

        // get repo token
        $tokenRepo = app('auth.password.broker')->getRepository();

        // generate token
        $token = $tokenRepo->create($user);

        // send notification
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

                // delete all old tokens (security)
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return ApiResponse::success('Password reset successful.');
        }

        return ApiResponse::error('Invalid token or email.', [], 400);
    }
}
