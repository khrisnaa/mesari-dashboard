<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\CityResource;
use App\Models\City;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Request $request)
    {
        $query = City::query();

        if ($request->filled('search') && strlen($request->search) >= 2) {
            $query->where('city_name', 'like', '%' . $request->search . '%');
        }

        $limit = $request->integer('limit', 20);

        $cities = $query
            ->orderBy('city_name')
            ->limit($limit)
            ->get();

        return ApiResponse::success(
            'List of Citiess',
            CityResource::collection($cities),
        );
    }
}
