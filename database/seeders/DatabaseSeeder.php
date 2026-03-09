<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // RolePermissionSeeder::class,
            UserSeeder::class,
            // UserAddressSeeder::class,
            ProductSeeder::class,
            // CartSeeder::class,
            // OrderSeeder::class,
            // CustomizationSeeder::class,
            BannerSeeder::class,
            TestimonialSeeder::class,
            FaqSeeder::class,
            CompanyProfileSeeder::class,
            // ProductReviewSeeder::class,
            PaymentMethodSeeder::class,
        ]);
    }
}
