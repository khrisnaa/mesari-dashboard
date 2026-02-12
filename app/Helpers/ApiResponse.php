<?php

namespace App\Helpers;

class ApiResponse
{
    public static function success(string $message, $data = null, int $code = 200, $meta = null)
    {
        $response = [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ];

        if ($meta) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $code);
    }

    public static function error(string $message, $errors = null, int $code = 400)
    {
        return response()->json(
            [
                'status' => 'error',
                'message' => $message,
                'errors' => $errors,
            ],
            $code,
        );
    }
}
