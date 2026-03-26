<?php

namespace App\Services\Api;

use App\Models\Customization;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomizationService
{
    public function storeCustomization($user, array $data)
    {
        $customDetails = $data['custom_details'];
        $uuid = Str::uuid()->toString();

        $product = Product::findOrFail($data['product_id']);

        if (! $product->is_customizable) {
            throw new \Exception('This product is not available for customization.');
        }

        $baseElementPrice = $product->custom_additional_price ?? 0;
        $totalAdditionalPrice = 0;
        $sides = ['front', 'back', 'leftSleeve', 'rightSleeve'];

        foreach ($sides as $side) {

            if (isset($customDetails[$side])) {

                if (isset($customDetails[$side]['has_design']) && $customDetails[$side]['has_design'] === true) {

                    $designData = $customDetails[$side]['design_data'] ?? [];

                    if (is_string($designData)) {
                        $designData = json_decode($designData, true);
                    }

                    if (is_array($designData)) {
                        foreach ($designData as $key => $element) {

                            $baseWidth = isset($element['width']) ? (float) $element['width'] : 100;
                            $baseHeight = isset($element['height']) ? (float) $element['height'] : 100;
                            $scale = isset($element['scale']) ? (float) $element['scale'] : 1;

                            $actualWidthPx = $baseWidth * $scale;
                            $actualHeightPx = $baseHeight * $scale;

                            $referenceWrapperWidthPx = 450;

                            $shirtPhysicalWidthCm = 42;

                            $physicalWrapperWidthCm = $shirtPhysicalWidthCm * 2;

                            $pixelToCmRatio = $physicalWrapperWidthCm / $referenceWrapperWidthPx;

                            $estWidthCm = $actualWidthPx * $pixelToCmRatio;
                            $estHeightCm = $actualHeightPx * $pixelToCmRatio;

                            $areaCm2 = $estWidthCm * $estHeightCm;

                            $multiplier = 1;

                            if ($areaCm2 <= 100) {
                                // Logo (10x10 cm)
                                $multiplier = 1;
                            } elseif ($areaCm2 <= 630) {
                                // A4 (21x30 cm)
                                $multiplier = 4;
                            } elseif ($areaCm2 <= 1260) {
                                // A3 (30x42 cm)
                                $multiplier = 7;
                            } else {
                                // A2 / Oversize
                                $multiplier = 10;
                            }

                            $elementCost = $baseElementPrice * $multiplier;
                            $totalAdditionalPrice += $elementCost;

                            if (
                                isset($element['type']) && $element['type'] === 'image' &&
                                isset($element['src']) && str_starts_with($element['src'], 'data:image')
                            ) {
                                $base64String = $element['src'];
                                $extension = 'png';

                                if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches)) {
                                    $extension = strtolower($matches[1]);
                                    if ($extension === 'jpeg') {
                                        $extension = 'jpg';
                                    }
                                }

                                $imageParts = explode(';base64,', $base64String);

                                if (count($imageParts) === 2) {
                                    $decodedImage = base64_decode($imageParts[1]);

                                    $fileName = $uuid.'_'.$side.'_element_'.$key.'.'.$extension;
                                    $filePath = 'customizations/elements/'.$fileName;

                                    Storage::disk('public')->put($filePath, $decodedImage);

                                    $designData[$key]['src'] = '/storage/'.$filePath;
                                }
                            }
                        }

                        $customDetails[$side]['design_data'] = $designData;
                    }
                }

                if (isset($customDetails[$side]['mockup_image_base64'])) {
                    $base64Image = $customDetails[$side]['mockup_image_base64'];

                    $imageParts = explode(';base64,', $base64Image);
                    if (count($imageParts) === 2) {
                        $imageBase64 = base64_decode($imageParts[1]);

                        $fileName = $uuid.'_'.$side.'.png';
                        $filePath = 'customizations/mockups/'.$fileName;

                        Storage::disk('public')->put($filePath, $imageBase64);

                        $customDetails[$side]['mockup_url'] = '/storage/'.$filePath;
                        unset($customDetails[$side]['mockup_image_base64']);
                    }
                }
            }
        }

        return Customization::create([
            'id' => $uuid,
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
            'product_variant_id' => $data['product_variant_id'],
            'total_custom_sides' => $data['total_custom_sides'],
            'custom_details' => $customDetails,
            'additional_price' => $totalAdditionalPrice,
            'is_draft' => true,
        ]);
    }
}
