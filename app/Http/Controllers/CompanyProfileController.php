<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyProfile\UpdateCompanyProfileRequest;
use App\Services\CompanyProfileService;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{
    public function __construct(
        protected CompanyProfileService $companyProfileService
    ) {}

    public function edit()
    {
        $profile = $this->companyProfileService->get()
            ?? $this->companyProfileService->initialize();

        return Inertia::render('company-profile/edit', [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request)
    {
        $profile = $this->companyProfileService->get()
            ?? $this->companyProfileService->initialize();

        $this->companyProfileService->update($profile, $request->validated());

        return redirect()->route('company-profile.edit')
            ->with('success', 'Company profile successfully updated.');
    }
}
