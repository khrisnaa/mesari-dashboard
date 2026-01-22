<?php

namespace App\Services;

use App\Models\Attribute;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductService
{
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
                    'is_published' => $data['is_published']
                ]);


                $variants = json_decode($data['variants'], true) ?? [];

                foreach ($variants as $variant) {

                    $colorId = null;

                    if (!empty($variant['color']['name'])) {
                        $color = Attribute::firstOrCreate([
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


                if (!empty($data['discount']) && is_array($data['discount'])) {


                    $discount = [
                        'type'      => $data['discount']['type'] ?? null,
                        'value'     => $data['discount']['value'] ?? 0,
                        'start_at'  => !empty($data['discount']['start_at'])
                            ? Carbon::parse($data['discount']['start_at'])
                            : null,
                        'end_at'    => !empty($data['discount']['end_at'])
                            ? Carbon::parse($data['discount']['end_at'])
                            : null,
                    ];


                    if (!empty($discount['type'])) {
                        $product->discount()->create($discount);
                    }
                }


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

    public function update(Product $product, array $data): Product
    {
        $basePath = null;

        try {
            return DB::transaction(function () use ($product, $data, &$basePath) {

                $product->update([
                    'name'        => $data['name'],
                    'description' => $data['description'],
                    'category_id' => $data['category_id'],
                    'is_published' => $data['is_published']
                ]);


                $variants = json_decode($data['variants'], true) ?? [];

                foreach ($variants as &$variant) {
                    if (!empty($variant['color']['name'])) {
                        $color = Attribute::firstOrCreate([
                            'name' => $variant['color']['name'],
                            'hex'  => $variant['color']['hex'],
                            'type' => 'color',
                        ]);

                        $variant['color']['id'] = $color->id;
                    }
                }

                $existingVariants = ProductVariant::withTrashed()
                    ->with('attributes')
                    ->where('product_id', $product->id)
                    ->get();

                $activeVariantIds = [];

                foreach ($variants as $variant) {
                    $matchedVariant = $existingVariants->first(function ($v) use ($variant) {
                        $attrs = $v->attributes;
                        return
                            $attrs->contains('id', $variant['size']['id'] ?? null) &&
                            (!isset($variant['color']['id']) ||
                                $attrs->contains('id', $variant['color']['id']));
                    });

                    if ($matchedVariant) {
                        if ($matchedVariant->trashed()) {
                            $matchedVariant->restore();
                        }

                        $matchedVariant->update([
                            'price' => $variant['price'],
                            'stock' => $variant['stock'],
                        ]);

                        $productVariant = $matchedVariant;
                    } else {
                        $productVariant = ProductVariant::create([
                            'product_id' => $product->id,
                            'price'      => $variant['price'],
                            'stock'      => $variant['stock'],
                        ]);
                    }

                    $productVariant->attributes()->sync(
                        collect([
                            $variant['size']['id'] ?? null,
                            $variant['color']['id'] ?? null,
                        ])->filter()
                    );

                    $activeVariantIds[] = $productVariant->id;
                }


                $existingVariants
                    ->whereNotIn('id', $activeVariantIds)
                    ->each(fn($v) => $v->delete());

                if (!empty($data['discount']) && is_array($data['discount'])) {

                    $discountInput = [
                        'type'      => $data['discount']['type'] ?? null,
                        'value'     => $data['discount']['value'] ?? 0,
                        'start_at'  => !empty($data['discount']['start_at'])
                            ? Carbon::parse($data['discount']['start_at'])
                            : null,
                        'end_at'    => !empty($data['discount']['end_at'])
                            ? Carbon::parse($data['discount']['end_at'])
                            : null,
                    ];

                    if (empty($discountInput['type'])) {

                        $product->discount()->delete();
                    } else {

                        $existingDiscount = $product->discount()->latest()->first();

                        if ($existingDiscount) {

                            $existingDiscount->update($discountInput);
                        } else {

                            $product->discount()->create($discountInput);
                        }
                    }
                }

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

    public function delete(Product $product): bool
    {
        return $product->delete();
    }


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

        // Delete removed images
        $existing->whereNotIn('id', $keepIds)->each(function ($image) {
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
            $image->delete();
        });

        // Update existing images
        $state->filter(fn($s) => isset($s['id']))->each(function ($s) {
            ProductImage::where('id', $s['id'])->update([
                'type'       => $s['type'],
                'sort_order' => $s['sort_order'] ?? 0,
            ]);
        });

        // Create new images from state
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

        // Remaining uploads → gallery
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
