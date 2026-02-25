<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'bank_name' => 'BCA',
                'account_number' => '1234567890',
                'account_owner' => 'Khrisna Dharma',
                'is_active' => true,
            ],
            [
                'bank_name' => 'Mandiri',
                'account_number' => '9876543210',
                'account_owner' => 'Khrisna Dharma',
                'is_active' => true,
            ],
            [
                'bank_name' => 'BNI',
                'account_number' => '5544332211',
                'account_owner' => 'Khrisna Dharma',
                'is_active' => true,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::create($method);
        }
    }
}
