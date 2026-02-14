<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\Controller;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => ['required', 'string'],
            'limit'  => ['nullable', 'integer'],
            'offset' => ['nullable', 'integer'],
        ]);

        $response = Http::timeout(10)
            ->withHeaders([
                'key' => config('services.rajaongkir.key'),
                'Accept' => 'application/json',
            ])
            ->get('https://rajaongkir.komerce.id/api/v1/destination/domestic-destination', [
                'search' => $request->search,
                'limit'  => $request->limit ?? 10,
                'offset' => $request->offset ?? 0,
            ]);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Failed to fetch destination.'
            ], 500);
        }

        $data = $response->json();

        return response()->json([
            'data' => collect($data['data'] ?? [])->map(function ($item) {
                return [
                    'id' => $item['id'],
                    'province_name' => $item['province_name'],
                    'city_name' => $item['city_name'],
                    'district_name' => $item['district_name'],
                    'subdistrict_name' => $item['subdistrict_name'],
                    'zip_code' => $item['zip_code'] ?? null,
                ];
            })->values(),
        ]);
    }
}
