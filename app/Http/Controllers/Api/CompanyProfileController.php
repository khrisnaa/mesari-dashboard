<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CompanyProfileResource;
use App\Models\CompanyProfile;

class CompanyProfileController extends Controller
{

    public function index()
    {
        $company = CompanyProfile::first();

        return ApiResponse::success("Company profile", [
            'item' => new CompanyProfileResource($company)
        ]);
    }
}
