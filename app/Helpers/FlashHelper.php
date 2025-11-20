<?php

namespace App\Helpers;

class FlashHelper
{
    public static function stamp(string $message): string
    {
        return $message . ' -#' . now() . '#';
    }

    public static function clean(string $message): string
    {
        return preg_replace('/-#.*?#/', '', $message);
    }
}
