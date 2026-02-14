<?php

return [
    'api_key' => env('SHIPPING_COST_API_KEY'),
    'origin' => 26551,
    'courier' => 'jne:sicepat:jnt:anteraja',
    'destination_api_url' => env('SHIPPING_DESTINATION_API_URL'),
    'cost_api_url' => env('SHIPPING_COST_API_URL'),
];
