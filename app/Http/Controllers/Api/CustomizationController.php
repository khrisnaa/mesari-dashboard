<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customization\CustomizationCheckoutRequest;
use App\Http\Requests\Api\Customization\StoreCustomizationRequest;
use App\Http\Resources\CustomizationResource;
use App\Http\Resources\OrderResource;
use App\Models\Customization;
use App\Services\Api\CustomizationService;
use App\Services\Api\OrderService;
use Illuminate\Support\Facades\Auth;

class CustomizationController extends Controller
{
    protected $customizationService;

    protected $orderService;

    public function __construct(CustomizationService $customizationService, OrderService $orderService)
    {
        $this->customizationService = $customizationService;
        $this->orderService = $orderService;
    }

    public function store(StoreCustomizationRequest $request)
    {
        $customization = $this->customizationService->storeCustomization(
            Auth::user(),
            $request->validated()
        );

        return ApiResponse::success(
            'Customization saved successfully',
            new CustomizationResource($customization)
        );
    }

    public function checkout(CustomizationCheckoutRequest $request)
    {

        $order = $this->orderService->customizationCheckout(
            Auth::user(),
            $request->validated()
        );

        return ApiResponse::success(
            'Custom order checkout successful',
            new OrderResource($order)
        );
    }

    public function show($id)
    {
        $customization = Customization::with('product.images')
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        return ApiResponse::success(
            'Customization details retrieved successfully',
            new CustomizationResource($customization)
        );
    }
}
