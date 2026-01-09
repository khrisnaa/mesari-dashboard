<?php

return [

    'modules' => [
        'dashboard' => ['view'],
        'user' => ['view', 'update', 'update.status'],
        'category' => ['view', 'create', 'update', 'delete'],
        'product' => ['view', 'create', 'update', 'delete'],
        'cart' => ['view', 'update'],
        'order' => ['view', 'create', 'cancel', 'update', 'update.status'],
        'address' => ['view', 'create', 'update', 'delete'],
        'testimonial' => ['create', 'update', 'delete'],
        'faq' => ['create', 'update', 'delete'],
    ],

    'roles' => [
        'superadmin' => ['*'],

        'admin' => [
            'dashboard.view',
            'product.*',
            'category.*',
            'order.view',
            'order.update',
            'order.update.status',
            'order.cancel',
            'user.*',
            'testimonial.*',
            'faq.*',
        ],

        'member' => [
            'product.view',
            'cart.view',
            'cart.update',
            'order.view',
            'order.create',
            'order.cancel',
            'address.*',
        ],

        'guest' => [
            'product.view',
        ],
    ],
];
