<?php

namespace App\Services\Admin;

use App\Models\CompanyProfile;

class CompanyProfileService
{
    public function get(): CompanyProfile
    {
        return CompanyProfile::first();
    }

    public function update(CompanyProfile $profile, array $data): bool
    {
        return $profile->update($data);
    }

    public function initialize(): CompanyProfile
    {
        return CompanyProfile::firstOrCreate([], [
            'company_name' => 'Your Company Name',
            'email' => 'admin@example.com',
            'phone' => '0000000000',
            'whatsapp' => '0000000000',
            'address' => 'Default Address',
            'city' => 'City',
            'province' => 'Province',
            'postal_code' => '00000',
            'google_map_url' => '#',
            'working_hours' => '08:00 - 17:00',
        ]);
    }
}
