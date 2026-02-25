<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailApi extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $verifyUrl = config('app.url').'/api/email/verify/'.
            $notifiable->id.'/'.sha1($notifiable->email);

        return (new MailMessage)
            ->subject('Complete Your Registration')
            ->greeting('Hello, '.$notifiable->name.'!')
            ->line('Thank you for joining us. We’re excited to have you as part of our community.')
            ->line('Before we get started, please confirm your email address by clicking the button below.')
            ->action('Confirm Email', $verifyUrl)
            ->line('If you didn’t create an account, you can safely ignore this email.')
            ->salutation('Warm regards, '.config('app.name'));
    }
}
