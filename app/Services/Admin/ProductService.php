<?php

namespace App\Services\Admin;

use App\Models\VariantAttribute;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductService
{
    // paginate products with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage   = $params['per_page'] ?? 10;
        $sort      = $params['sort'] ?? 'created_at';
        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';
        $search    = $params['search'] ?? null;

        return Product::query()
            ->withSum('variants as total_stock', 'stock')
            ->with([
                'category',
                'variants' => fn($query) =>
                $query->with('attributes')->orderBy('price', 'asc')
            ])
            ->when(
                $search,
                fn($q) =>
                $q->where('name', 'like', "%{$search}%")
            )
            ->when(
                $sort === 'stock',
                fn($q) =>
                $q->orderBy('total_stock', $direction)
            )
            ->when(
                $sort === 'price',
                fn($q) =>
                $q->orderBy(
                    ProductVariant::select('price')
                        ->whereColumn('product_id', 'products.id')
                        ->orderBy('price', 'asc')
                        ->limit(1),
                    $direction
                )
            )
            ->when(!in_array($sort, ['price', 'stock']), function ($q) use ($sort, $direction) {
                if ($sort) {
                    $q->orderBy($sort, $direction)->orderBy('id');
                } else {
                    $q->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                }
            })
            ->paginate($perPage)
            ->withQueryString();
    }

    // store a new product
    public function store(array $data): Product
    {
        $basePath = null;

        try {
            return DB::transaction(function () use ($data, &$basePath) {

                $data['slug'] = Str::slug($data['name']);

                $product = Product::create([
                    'name'        => $data['name'],
                    'slug'        => $data['slug'],
                    'description' => $data['description'],
                    'category_id' => $data['category_id'],
                    'is_published' => $data['is_published'],
                    'is_customizable'    => $data['is_customizable'] ?? false,
                    'custom_additional_price'   => $data['custom_additional_price'] ?? null,
                    'discount_type'      => $data['discount_type'] ?? null,
                    'discount_value'     => $data['discount_value'] ?? null,
                    'discount_start_at'  => $data['discount_start_at'] ?? null,
                    'discount_end_at'    => $data['discount_end_at'] ?? null,
                ]);


                $variants = json_decode($data['variants'], true) ?? [];

                foreach ($variants as $variant) {

                    $colorId = null;

                    if (!empty($variant['color']['name'])) {
                        $color = VariantAttribute::firstOrCreate([
                            'name' => $variant['color']['name'],
                            'hex'  => $variant['color']['hex'],
                            'type' => 'color',
                        ]);

                        $colorId = $color->id;
                    }

                    $productVariant = ProductVariant::create([
                        'product_id' => $product->id,
                        'price'      => $variant['price'],
                        'stock'      => $variant['stock'],
                    ]);

                    $attributeIds = collect([
                        $variant['size']['id'] ?? null,
                        $colorId,
                    ])->filter();

                    $productVariant->attributes()->sync($attributeIds);
                }


                // if (!empty($data['discount']) && is_array($data['discount'])) {


                //     $discount = [
                //         'type'      => $data['discount']['type'] ?? null,
                //         'value'     => $data['discount']['value'] ?? 0,
                //         'start_at'  => !empty($data['discount']['start_at'])
                //             ? Carbon::parse($data['discount']['start_at'])
                //             : null,
                //         'end_at'    => !empty($data['discount']['end_at'])
                //             ? Carbon::parse($data['discount']['end_at'])
                //             : null,
                //     ];


                //     if (!empty($discount['type'])) {
                //         $product->discount()->create($discount);
                //     }
                // }


                if (!empty($data['images'])) {

                    $basePath = 'product-images/' . $product->slug . '/' . now()->format('Y/m/d');

                    $thumbnail = collect($data['images'])
                        ->firstWhere('type', 'thumbnail');

                    $gallery = collect($data['images'])
                        ->where('type', 'gallery')
                        ->values();

                    if ($thumbnail) {
                        $path = $thumbnail['file']->store($basePath, 'public');

                        ProductImage::create([
                            'product_id' => $product->id,
                            'path'       => $path,
                            'type'       => 'thumbnail',
                        ]);
                    }

                    foreach ($gallery as $index => $image) {
                        $path = $image['file']->store($basePath, 'public');

                        ProductImage::create([
                            'product_id' => $product->id,
                            'path'       => $path,
                            'type'       => 'gallery',
                            'sort_order' => $index,
                        ]);
                    }
                }

                return $product;
            });
        } catch (\Throwable $e) {

            if ($basePath && Storage::disk('public')->exists($basePath)) {
                Storage::disk('public')->deleteDirectory($basePath);
            }

            throw $e;
        }
    }

    // update a prdouct
    public function update(Product $product, array $data): Product
    {
        $basePath = null;

        try {
            return DB::transaction(function () use ($product, $data, &$basePath) {

                // update basic product fields
                $product->update([
                    'name'        => $data['name'],
                    'description' => $data['description'],
                    'category_id' => $data['category_id'],
                    'is_published' => $data['is_published'],
                    'is_customizable'    => $data['is_customizable'] ?? false,
                    'custom_additional_price'   => $data['custom_additional_price'] ?? null,
                    'discount_type'      => $data['discount_type'] ?? null,
                    'discount_value'     => $data['discount_value'] ?? null,
                    'discount_start_at'  => $data['discount_start_at'] ?? null,
                    'discount_end_at'    => $data['discount_end_at'] ?? null,
                    'weight'    => $data['weight'] ?? 0,
                ]);

                // decode variants from request
                $variants = json_decode($data['variants'], true) ?? [];

                // normalize color id 
                foreach ($variants as $idx => $variant) {
                    if (!empty($variant['color']['name'])) {
                        $color = VariantAttribute::firstOrCreate(
                            ['type' => 'color', 'name' => $variant['color']['name']],
                            ['hex' => $variant['color']['hex']]
                        );

                        $variants[$idx]['color']['id'] = $color->id;
                    }
                }


                // active ids for final deletion
                $activeVariantIds = [];

                // loop through all incoming variants
                foreach ($variants as $variant) {

                    // refresh existing variants every loop
                    // (so attributes sync does not break matching)
                    $existingVariants = ProductVariant::withTrashed()
                        ->with('attributes')
                        ->where('product_id', $product->id)
                        ->get();

                    // build incoming attr set (size + color)
                    $incomingAttrIds = collect([
                        $variant['size']['id'],
                        $variant['color']['id'] ?? null,
                    ])->filter()->sort()->values()->all();

                    // matching (size+color)
                    $matchedVariant = $existingVariants->first(function ($v) use ($incomingAttrIds) {
                        $existingAttrIds = $v->attributes->pluck('id')->sort()->values()->all();
                        return $existingAttrIds === $incomingAttrIds;
                    });

                    // save
                    if ($matchedVariant) {

                        Log::info('✔ MATCH FOUND', [
                            'variant_id' => $matchedVariant->id,
                            'incoming_attrs' => $incomingAttrIds
                        ]);

                        if ($matchedVariant->trashed()) {
                            $matchedVariant->restore();
                        }

                        $matchedVariant->update([
                            'price' => $variant['price'],
                            'stock' => $variant['stock'],
                        ]);

                        $productVariant = $matchedVariant;
                    } else {

                        Log::info('✘ MATCH NOT FOUND → CREATE NEW', [
                            'incoming_attrs' => $incomingAttrIds
                        ]);

                        $productVariant = ProductVariant::create([
                            'product_id' => $product->id,
                            'price'      => $variant['price'],
                            'stock'      => $variant['stock'],
                        ]);
                    }

                    // attach attributes (always size + color)
                    $productVariant->attributes()->sync($incomingAttrIds);

                    // push fresh id
                    $activeVariantIds[] = $productVariant->id;

                    Log::info("ACTIVE IDS NOW", $activeVariantIds);
                }

                // remove variants not included
                ProductVariant::withTrashed()
                    ->where('product_id', $product->id)
                    ->whereNotIn('id', $activeVariantIds)
                    ->each(fn($v) => $v->delete());

                // discount handling
                // if (!empty($data['discount']) && is_array($data['discount'])) {
                //     $discountInput = [
                //         'type'      => $data['discount']['type'] ?? null,
                //         'value'     => $data['discount']['value'] ?? 0,
                //         'start_at'  => !empty($data['discount']['start_at'])
                //             ? Carbon::parse($data['discount']['start_at'])
                //             : null,
                //         'end_at'    => !empty($data['discount']['end_at'])
                //             ? Carbon::parse($data['discount']['end_at'])
                //             : null,
                //     ];

                //     if (empty($discountInput['type'])) {

                //         $product->discount()->delete();
                //     } else {

                //         $existingDiscount = $product->discount()->latest()->first();

                //         if ($existingDiscount) {
                //             $existingDiscount->update($discountInput);
                //         } else {
                //             $product->discount()->create($discountInput);
                //         }
                //     }
                // }

                // images sync
                $this->syncImages(
                    product: $product,
                    imageState: json_decode($data['image_state'], true) ?? [],
                    uploads: $data['images_upload'] ?? [],
                    basePath: $basePath
                );

                return $product;
            });
        } catch (\Throwable $e) {

            if ($basePath && Storage::disk('public')->exists($basePath)) {
                Storage::disk('public')->deleteDirectory($basePath);
            }

            throw $e;
        }
    }

    // delete a product
    public function delete(Product $product): bool
    {
        return $product->delete();
    }

    // update product status only
    public function updateStatus(Product $product, bool $isPublished): void
    {
        $product->update([
            'is_published' => $isPublished,
        ]);
    }

    // process and store images coming from the frontend
    private function syncImages(
        Product $product,
        array $imageState,
        array $uploads,
        ?string &$basePath
    ): void {
        $state   = collect($imageState);
        $uploads = collect($uploads);

        $basePath = 'product-images/' . $product->slug . '/' . now()->format('Y/m/d');

        $existing = ProductImage::where('product_id', $product->id)->get();
        $keepIds  = $state->pluck('id')->filter()->all();

        // delete removed images
        $existing->whereNotIn('id', $keepIds)->each(function ($image) {
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
            $image->delete();
        });

        // update existing images
        $state->filter(fn($s) => isset($s['id']))->each(function ($s) {
            ProductImage::where('id', $s['id'])->update([
                'type'       => $s['type'],
                'sort_order' => $s['sort_order'] ?? 0,
            ]);
        });

        // create new images from state
        $state->filter(fn($s) => !isset($s['id']))->each(function ($s) use ($uploads, $product, $basePath) {
            $file = $uploads->shift();
            if (! $file) return;

            ProductImage::create([
                'product_id' => $product->id,
                'path'       => $file->store($basePath, 'public'),
                'type'       => $s['type'] ?? 'gallery',
                'sort_order' => $s['sort_order'] ?? 0,
            ]);
        });

        // remaining uploads → gallery
        $nextSort = ProductImage::where('product_id', $product->id)
            ->where('type', 'gallery')
            ->max('sort_order') ?? 0;

        $uploads->each(function ($file) use ($product, $basePath, &$nextSort) {
            ProductImage::create([
                'product_id' => $product->id,
                'path'       => $file->store($basePath, 'public'),
                'type'       => 'gallery',
                'sort_order' => ++$nextSort,
            ]);
        });
    }
}
