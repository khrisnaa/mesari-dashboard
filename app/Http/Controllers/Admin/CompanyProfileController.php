<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Helpers\FlashHelper;
use App\Http\Requests\Admin\CompanyProfile\UpdateCompanyProfileRequest;
use App\Models\CompanyProfile;
use App\Services\Admin\CompanyProfileService;
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

    public function edit()
    {
        $profile = $this->companyProfileService->get()
            ?? $this->companyProfileService->initialize();

        return Inertia::render('company-profile/edit', [
            'profile' => $profile,
        ]);
    }

    public function update(UpdateCompanyProfileRequest $request, CompanyProfile $profile)
    {
        $this->companyProfileService->update($profile, $request->validated());

        return redirect()->route('company-profile.index')
            ->with('success', FlashHelper::stamp('Company profile successfully updated.'));
    }
}
