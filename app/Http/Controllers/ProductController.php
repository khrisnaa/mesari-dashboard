<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Product\CreateProductRequest;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{

    private function generateUniqueSlug(string $name): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;

        $count = 1;

        while (Product::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $sort = $request->input('sort');
        $direction = $request->input('direction') === 'asc' ? 'asc' : 'desc';

        $products = Product::query()
            ->withSum('variants as total_stock', 'stock')
            ->with(['category', 'variants' => function ($query) {
                $query->with('attributes')->orderBy('price', 'asc');
            }])
            ->when($request->search, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%");
            })
            ->when($sort === 'stock', function ($q) use ($direction) {
                $q->orderBy('total_stock', $direction);
            })
            ->when($sort === 'price', function ($q) use ($direction) {
                $q->orderBy(
                    ProductVariant::select('price')
                        ->whereColumn('product_id', 'products.id')
                        ->orderBy('price', 'asc')
                        ->limit(1),
                    $direction
                );
            })
            ->when(!in_array($sort, ['price', 'stock']), function ($q) use ($sort, $direction) {
                if ($sort) {
                    $q->orderBy($sort, $direction)->orderBy('id');
                } else {
                    $q->orderBy('created_at', 'desc')->orderBy('id', 'desc');
                }
            })
            ->paginate($perPage)
            ->withQueryString();


        return Inertia::render('products/index', [
            'products' => $products,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        $sizes = Attribute::where('type', 'size')
            ->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL')")
            ->get();

        $colors = Attribute::where('type', 'color')
            ->where(function ($q) {
                foreach (config('product.colors') as $color) {
                    $q->orWhere(function ($q2) use ($color) {
                        $q2->where('name', $color['name'])
                            ->where('hex', $color['hex']);
                    });
                }
            })
            ->orderByRaw("FIELD(name, 'White', 'Black') DESC")
            ->orderBy('name')
            ->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
            'colors' => $colors,
            'sizes' => $sizes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateProductRequest $request)
    {
        DB::beginTransaction();

        $basePath = null;

        try {
            $data = $request->validated();

            $data['slug'] = $this->generateUniqueSlug($data['name']);

            $product = Product::create([
                'name'        => $data['name'],
                'slug'        => $data['slug'],
                'description' => $data['description'],
                'category_id' => $data['category_id'],
            ]);

            $variants = json_decode($data['variants'], true);


            foreach ($variants as $key => $variant) {
                if (isset($variant['color']) && !empty($variant['color']['name'])) {
                    $color = Attribute::firstOrCreate([
                        'name' => $variant['color']['name'],
                        'hex'  => $variant['color']['hex'],
                        'type' => 'color',
                    ]);

                    $variants[$key]['color']['id'] = $color->id;
                }
            }

            foreach ($variants as $variant) {
                $skuParts = [
                    $product->name,
                    data_get($variant, 'size.name'),
                    data_get($variant, 'color.name'),
                ];

                $sku = strtoupper(Str::slug(
                    collect($skuParts)->filter()->join('-'),
                    '-'
                ));

                $productVariant =  ProductVariant::create([
                    'price' => $variant['price'],
                    'stock' => $variant['stock'],
                    'sku' => $sku,
                    'product_id' => $product->id
                ]);

                $attributeIds = collect([
                    $variant['size']['id'] ?? null,
                    $variant['color']['id'] ?? null,
                ])->filter();

                $productVariant->attributes()->sync($attributeIds);
            }

            if (isset($data['images'])) {
                $images = $data['images'];
                $gallery = [];
                $thumbnail = null;

                foreach ($images as $image) {
                    if ($image['type'] === 'thumbnail') {
                        $thumbnail = $image;
                    } else {
                        $gallery[] = $image;
                    }
                }

                $basePath = 'product-images/' . $product->slug . '/' . now()->format('Y/m/d');

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

            DB::commit();

            return redirect()->route('products.index')->with('success',  FlashHelper::stamp('Product created successfully'));
        } catch (\Throwable $e) {
            DB::rollBack();

            if ($basePath && Storage::disk('public')->exists($basePath)) {
                Storage::disk('public')->deleteDirectory($basePath);
            }

            Log::error($e->getMessage());
            return back()->withErrors(['error' => FlashHelper::stamp('Failed to create product.') . $e->getMessage()]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::all();

        $sizes = Attribute::where('type', 'size')
            ->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL')")
            ->get();

        $colors = Attribute::where('type', 'color')
            ->where(function ($q) {
                foreach (config('product.colors') as $color) {
                    $q->orWhere(function ($q2) use ($color) {
                        $q2->where('name', $color['name'])
                            ->where('hex', $color['hex']);
                    });
                }
            })
            ->orderByRaw("FIELD(name, 'White', 'Black') DESC")
            ->orderBy('name')
            ->get();

        $product = Product::with(['category', 'variants.attributes', 'images'])
            ->where('id', $product->id)
            ->first();

        return Inertia::render('products/edit', [
            'product' => $product,
            'categories' => $categories,
            'colors' => $colors,
            'sizes' => $sizes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    public function storeVariant(Request $request)
    {
        dd($request->all());
    }
}
