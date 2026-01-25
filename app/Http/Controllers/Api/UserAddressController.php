<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\User\StoreAddressRequest;
use App\Http\Requests\Api\User\UpdateAddressRequest;
use App\Http\Resources\UserAddressResource;
use App\Models\UserAddress;
use App\Services\Api\UserAddressService;
use Illuminate\Support\Facades\Auth;

class UserAddressController extends Controller
{
    public function __construct(
        protected UserAddressService $addressService
    ) {}

    public function index()
    {
        $addresses = $this->addressService->list(Auth::id());

        return ApiResponse::success(
            'Address list fetched successfully',
            UserAddressResource::collection($addresses)
        );
    }

    public function store(StoreAddressRequest $request)
    {
        $address = $this->addressService
            ->store(Auth::id(), $request->validated());

        return ApiResponse::success(
            'Address created successfully',
            new UserAddressResource($address)
        );
    }

    public function show(string $id)
    {
        $address = UserAddress::where('user_id', Auth::id())
            ->findOrFail($id);

        return ApiResponse::success(
            'Address detail fetched successfully',
            new UserAddressResource($address)
        );
    }

    public function update(UpdateAddressRequest $request, string $id)
    {
        $address = UserAddress::where('user_id', Auth::id())
            ->findOrFail($id);

        $updated = $this->addressService
            ->update($address, $request->validated());

        return ApiResponse::success(
            'Address updated successfully',
            new UserAddressResource($updated)
        );
    }

    public function destroy(string $id)
    {
        $address = UserAddress::where('user_id', Auth::id())
            ->findOrFail($id);

        $this->addressService->delete($address);

        return ApiResponse::success('Address deleted successfully');
    }
}
