<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customization\UpdateCustomizationRequest;
use App\Models\Customization;
use App\Services\Admin\CustomizationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomizationController extends Controller
{
    public function __construct(protected CustomizationService $customizationService) {}

    public function index(Request $request)
    {
        return Inertia::render('customizations/index', [
            'customizations' => $this->customizationService->paginate($request->all()),
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function edit(Customization $customization)
    {

        $customization->load(['user', 'product.images', 'productVariant']);

        $baseImages = [];
        if ($customization->product && $customization->product->images) {
            foreach ($customization->product->images as $img) {
                $key = $img->type;
                if ($key === 'left') {
                    $key = 'leftSleeve';
                }
                if ($key === 'right') {
                    $key = 'rightSleeve';
                }

                $baseImages[$key] = $img->path ? asset('storage/'.$img->path) : null;
            }
        }

        $details = is_string($customization->custom_details)
            ? json_decode($customization->custom_details, true)
            : $customization->custom_details;

        $customizationData = array_merge($customization->toArray(), [
            'custom_details' => $details,
            'base_images' => $baseImages,
        ]);

        return Inertia::render('customizations/edit', [
            'customization' => $customizationData,
        ]);
    }

    public function update(UpdateCustomizationRequest $request, Customization $customization)
    {
        $this->customizationService->update($customization, $request->validated());

        return redirect()->route('customizations.index')
            ->with('success', "Customization #{$customization->id} updated successfully.");
    }
}
