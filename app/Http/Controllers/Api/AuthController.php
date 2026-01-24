<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\Api\Auth\RegisterRequest;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // send email verification
        $user->sendEmailVerificationNotification();

        return ApiResponse::success(
            'Account created successfully. Please verify your email.',
            [
                'user' => new UserResource($user),
                'must_verify_email' => true
            ],
            201
        );
    }


    public function login(LoginRequest $request)
    {
        // check user exist or not
        $user = User::where('email', $request->email)->first();

        if (! $user || !Hash::check($request->password, $user->password)) {
            return ApiResponse::error('Invalid credentials', [], 401);
        }

        // verification check
        if (!$user->hasVerifiedEmail()) {
            return ApiResponse::error('Please verify your email first.', [], 403);
        }

        // reset old token
        $user->tokens()->delete();

        // create new token
        $token = $user->createToken($request->userAgent() ?? 'api_token')->plainTextToken;

        return ApiResponse::success(
            'Login successful.',
            [
                'user'       => new UserResource($user),
                'token'      => $token,
            ]
        );
    }


    public function resendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return ApiResponse::error('Email already verified.', 400);
        }

        $user->sendEmailVerificationNotification();

        return ApiResponse::success('Verification email sent.');
    }

    public function verifyEmail(Request $request)
    {
        $user = User::findOrFail($request->route('id'));

        if (! hash_equals(
            (string) $request->route('hash'),
            sha1($user->email)
        )) {
            return redirect(env('FRONTEND_URL') . '/verify/error');
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
        }

        return redirect(env('FRONTEND_URL') . '/login?verified=1');
    }

    public function logout(Request $request)
    {
        // delete token
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success('Logout successful.');
    }
}
