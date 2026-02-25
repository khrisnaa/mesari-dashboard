<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordApi extends Notification implements ShouldQueue
{
    use Queueable;

    public string $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = config('app.frontend_url')."/reset-password?token={$this->token}&email={$notifiable->email}";

        return (new MailMessage)
            ->subject('Security: Password Reset Request')
            ->greeting('HELLO, '.strtoupper($notifiable->name))
            ->line('You are receiving this email because we received a password reset request for your account.')
            ->line('To proceed with the password reset, please click the secure link below:')
            ->action('RESET PASSWORD', $url)
            ->line('This password reset link will expire in 60 minutes.')
            ->line('If you did not request a password reset, no further action is required. Your account remains secure.')
            ->salutation('WARM REGARDS, '.strtoupper(config('app.name')));
    }
}
