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
            if (isset($customDetails[$side]['has_design']) && $customDetails[$side]['has_design'] === true) {

                $designData = $customDetails[$side]['design_data'] ?? [];

                if (is_string($designData)) {
                    $designData = json_decode($designData, true);
                }

                if (is_array($designData)) {
                    // Gunakan index ($key) agar kita bisa memodifikasi array aslinya
                    foreach ($designData as $key => $element) {

                        // 1. Kalkulasi Harga
                        $scale = isset($element['scale']) ? (float) $element['scale'] : 1;
                        $elementCost = $baseElementPrice * $scale;
                        $totalAdditionalPrice += $elementCost;

                        // 🔥 2. CEK JIKA ELEMEN ADALAH GAMBAR BASE64 (UPLOAD USER) 🔥
                        if (
                            isset($element['type']) && $element['type'] === 'image' &&
                            isset($element['src']) && str_starts_with($element['src'], 'data:image')
                        ) {
                            $base64String = $element['src'];

                            // Ambil ekstensi file (png, jpg, jpeg)
                            $extension = 'png'; // default
                            if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $matches)) {
                                $extension = strtolower($matches[1]);
                                if ($extension === 'jpeg') {
                                    $extension = 'jpg';
                                }
                            }

                            // Pisahkan header dan data utamanya
                            $imageParts = explode(';base64,', $base64String);

                            if (count($imageParts) === 2) {
                                $decodedImage = base64_decode($imageParts[1]);

                                // Buat nama file unik (contoh: uuid_front_element_0.png)
                                $fileName = $uuid.'_'.$side.'_element_'.$key.'.'.$extension;
                                $filePath = 'customizations/elements/'.$fileName;

                                // Simpan file fisik ke folder storage/app/public/customizations/elements/
                                Storage::disk('public')->put($filePath, $decodedImage);

                                // 🔥 GANTI STRING PANJANG BASE64 DENGAN URL PATH 🔥
                                $designData[$key]['src'] = '/storage/'.$filePath;
                            }
                        }
                    }

                    // Timpa kembali design_data yang lama dengan yang sudah dibersihkan dari Base64
                    $customDetails[$side]['design_data'] = $designData;
                }

                // --- PROCESS MOCKUP BASE64 IMAGE (Tetap sama seperti sebelumnya) ---
                if (isset($customDetails[$side]['mockup_image_base64'])) {
                    $base64Image = $customDetails[$side]['mockup_image_base64'];

                    $imageParts = explode(';base64,', $base64Image);
                    $imageBase64 = base64_decode($imageParts[1]);

                    $fileName = $uuid.'_'.$side.'.png';
                    $filePath = 'customizations/mockups/'.$fileName;

                    Storage::disk('public')->put($filePath, $imageBase64);

                    $customDetails[$side]['mockup_url'] = '/storage/'.$filePath;
                    unset($customDetails[$side]['mockup_image_base64']);
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
