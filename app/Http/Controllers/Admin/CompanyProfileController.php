<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\FlashHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CompanyProfile\UpdateCompanyProfileRequest;
use App\Models\CompanyProfile;
use App\Services\Admin\CompanyProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function __construct(
        protected CompanyProfileService $companyProfileService
    ) {}

    public function index()
    {
        $profile = $this->companyProfileService->get()
            ?? $this->companyProfileService->initialize();

        return Inertia::render('company-profile/index', [
            'profile' => $profile,
        ]);
    }

    public function edit(Request $request)
    {

        $profile = $this->companyProfileService->get()
            ?? $this->companyProfileService->initialize();

        return Inertia::render('company-profile/edit', [
            'profile' => $profile,
            'locations' => Inertia::lazy(function () use ($request) {

                if (empty(trim($request->search))) {
                    return [];
                }

                $response = Http::timeout(10)
                    ->withHeaders([
                        'key' => config('rajaongkir.api_key'),
                        'Accept' => 'application/json',
                    ])
                    ->get(config('rajaongkir.destination_api_url'), [
                        'search' => $request->search,
                        'limit' => $request->limit ?? 10,
                        'offset' => $request->offset ?? 0,
                    ]);

                if (! $response->successful()) {
                    return [];
                }

                $data = $response->json();

                return collect($data['data'] ?? [])->map(function ($item) {
                    return [
                        'id' => $item['id'],
                        'province_name' => $item['province_name'],
                        'city_name' => $item['city_name'],
                        'district_name' => $item['district_name'],
                        'subdistrict_name' => $item['subdistrict_name'],
                        'zip_code' => $item['zip_code'] ?? null,
                    ];
                })->values();
            }),
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request, CompanyProfile $profile)
    {
        $this->companyProfileService->update($profile, $request->validated());

        return redirect()->route('company-profile.index')
            ->with('success', FlashHelper::stamp('Company profile successfully updated.'));
    }
}
