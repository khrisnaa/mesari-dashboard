<?php

return [

    // Permission Modules
    'modules' => [
        'product' => ['index', 'show', 'create', 'update', 'delete'],
        'user'    => ['index', 'show', 'update'],
        'dashboard' => ['view'],
    ],

    //  Role Permissions Matrix
    'roles' => [

        'superadmin' => ['*'],   // dapat semua

        'admin' => [
            'product.*',
            'order.*',
            'user.*',

        ],
        'member' => [
            'product.index',
            'product.show',
        ],

        'guest' => [
            'product.index',
            'product.show',
        ],
    ],
];
