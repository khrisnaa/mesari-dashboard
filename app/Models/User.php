<?php

namespace App\Models;

use App\Notifications\ResetPasswordApi;
use App\Notifications\VerifyEmailApi;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasRoles, HasUuids, Notifiable, SoftDeletes, TwoFactorAuthenticatable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'avatar',
        'phone',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',

    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function customizations()
    {
        return $this->hasMany(Customization::class);
    }

    // public function reviews()
    // {
    //     return $this->hasMany(ProductReview::class);
    // }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmailApi);
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new ResetPasswordApi($token));
    }
}
