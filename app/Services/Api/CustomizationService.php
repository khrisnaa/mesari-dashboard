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

        // 1. Fetch the product to validate and get pricing
        $product = Product::findOrFail($data['product_id']);

        if (! $product->is_customizable) {
            throw new \Exception('This product is not available for customization.');
        }

        // Ambil harga dasar kustomisasi per elemen dari database Product
        $baseElementPrice = $product->custom_additional_price ?? 0;

        $totalAdditionalPrice = 0;
        $sides = ['front', 'back', 'leftSleeve', 'rightSleeve'];

        // 2. Iterate through each side to calculate price and save images
        foreach ($sides as $side) {
            if (isset($customDetails[$side]['has_design']) && $customDetails[$side]['has_design'] === true) {

                // --- A. CALCULATE PRICE BASED ON ELEMENTS & SCALE ---
                $designData = $customDetails[$side]['design_data'] ?? [];

                if (is_string($designData)) {
                    $designData = json_decode($designData, true);
                }

                if (is_array($designData)) {
                    foreach ($designData as $element) {
                        $scale = isset($element['scale']) ? (float) $element['scale'] : 1;
                        $elementCost = $baseElementPrice * $scale;
                        $totalAdditionalPrice += $elementCost;
                    }
                }

                // --- B. PROCESS BASE64 IMAGE ---
                if (isset($customDetails[$side]['mockup_image_base64'])) {
                    $base64Image = $customDetails[$side]['mockup_image_base64'];

                    $imageParts = explode(';base64,', $base64Image);
                    $imageBase64 = base64_decode($imageParts[1]);

                    // Nama file fisik
                    $fileName = $uuid.'_'.$side.'.png';
                    // Path untuk disimpan di disk 'public' (storage/app/public/customizations/mockups/...)
                    $filePath = 'customizations/mockups/'.$fileName;

                    // Simpan file fisik ke disk
                    Storage::disk('public')->put($filePath, $imageBase64);

                    // 🔥 GANTI DI SINI: Tambahkan '/storage/' untuk disimpan ke DB 🔥
                    $customDetails[$side]['mockup_url'] = '/storage/'.$filePath;

                    // Hapus string base64 yang berat agar tidak masuk ke DB
                    unset($customDetails[$side]['mockup_image_base64']);
                }
            }
        }

        // 3. Save to Database
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
