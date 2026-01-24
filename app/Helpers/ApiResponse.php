<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success($message, $data = null, $code = 200)
    {
        return response()->json([
            'status'  => 'success',
            'message' => $message,
            'data'    => $data,
        ], $code);
    }

    public static function error($message, $errors = null, $code = 400)
    {
        return response()->json([
            'status'  => 'error',
            'message' => $message,
            'errors'  => $errors,
        ], $code);
    }
}
