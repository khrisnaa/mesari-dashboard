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
        $url = env('FRONTEND_URL') . "/reset-password?token={$this->token}&email={$notifiable->email}";

        return (new MailMessage)
            ->subject('Reset Password Request')
            ->line('Click the button below to reset your password.')
            ->action('Reset Password', $url)
            ->line('If you did not request this, please ignore this email.');
    }
}
