<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyEmailApi extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verifyUrl = env('APP_URL') . "/api/email/verify/" .
            $notifiable->id . "/" . sha1($notifiable->email);

        return (new MailMessage)
            ->subject('Verify Your Email')
            ->line('Click the button below to verify your email.')
            ->action('Verify Email', $verifyUrl);
    }
}
