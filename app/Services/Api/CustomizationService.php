<?php

namespace App\Services\Api;

use App\Models\Customization;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CustomizationService
{
    public function storeCustomization($user, array $data)
    {
        $customDetails = $data['custom_details'];
        $uuid = Str::uuid()->toString();

        // Misal harga sablon per sisi adalah Rp 15.000
        $hargaSablonPerSisi = 15000;
        $additionalPrice = $data['total_custom_sides'] * $hargaSablonPerSisi;

        // Proses gambar Base64 menjadi file fisik
        foreach (['front', 'back', 'leftSleeve', 'rightSleeve'] as $side) {
            if (isset($customDetails[$side]['has_design']) && $customDetails[$side]['has_design'] === true) {

                $base64Image = $customDetails[$side]['mockup_image_base64'];

                // Pisahkan header base64 (data:image/png;base64,...)
                $imageParts = explode(';base64,', $base64Image);
                $imageBase64 = base64_decode($imageParts[1]);

                // Simpan file
                $fileName = $uuid.'_'.$side.'.png';
                $filePath = 'customizations/mockups/'.$fileName;
                Storage::disk('public')->put($filePath, $imageBase64);

                // Ganti data base64 dengan URL path untuk disimpan ke DB
                $customDetails[$side]['mockup_url'] = '/storage/'.$filePath;
                unset($customDetails[$side]['mockup_image_base64']);
            }
        }

        return Customization::create([
            'id' => $uuid,
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
            'product_variant_id' => $data['product_variant_id'],
            'total_custom_sides' => $data['total_custom_sides'],
            'custom_details' => json_encode($customDetails), // Simpan sebagai JSON string
            'additional_price' => $additionalPrice,
            'is_draft' => true,
        ]);
    }
}
