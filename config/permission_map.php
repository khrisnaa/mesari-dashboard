<?php

return [
    // Permission Modules
    'modules' => [
        'user' => ['view', 'create', 'update', 'delete', 'update.status'],
        'category' => ['view', 'create', 'update', 'delete'],
        'product' => ['view', 'create', 'update', 'delete'],
        'cart' => ['view', 'update'],
        'order' => ['view', 'create', 'update', 'update.status', 'cancel'],
        'address' => ['view', 'create', 'update', 'delete'],
        'testimonial' => ['view', 'create', 'update', 'delete'],
        'faq' => ['view', 'create', 'update', 'delete'],
        'dashboard' => ['view'],
    ],

    // Role → Permission Matrix
    'roles' => [
        // Full access
        'superadmin' => ['*'],

        // Internal admin
        'admin' => [
            'dashboard.view',

            'product.*',
            'category.*',
            'order.*',
            'user.*',
        ],

        // Logged-in user
        'member' => [
            'product.view',
            'cart.*',
            'order.create',
            'order.view',
            'address.*',
        ],

        // Public / non-login
        'guest' => [
            'product.view',
        ],
    ],
];
