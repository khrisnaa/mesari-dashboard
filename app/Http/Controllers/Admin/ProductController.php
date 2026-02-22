<?php

namespace App\Http\Controllers\Admin;

use App\Helpers\FlashHelper;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\VariantAttribute;
use App\Services\Admin\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    public function index(Request $request)
    {
        $products = $this->productService->paginate($request->all());

        return Inertia::render('products/index', [
            'products' => $products,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create()
    {
        $categories = Category::all();

        $sizes = VariantAttribute::where('type', 'size')
            ->when(
                DB::getDriverName() === 'mysql',
                fn ($q) => $q->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ALL')"),
                fn ($q) => $q->orderBy('name')
            )
            ->get();

        $colors = VariantAttribute::where('type', 'color')
            ->where(function ($q) {
                foreach (config('product.colors') as $color) {
                    $q->orWhere(function ($q2) use ($color) {
                        $q2->where('name', $color['name'])
                            ->where('hex', $color['hex']);
                    });
                }
            })
            ->when(
                DB::getDriverName() === 'mysql',
                fn ($q) => $q->orderByRaw("FIELD(name, 'White', 'Black') DESC"),
                fn ($q) => $q->orderBy('name')
            )
            ->get();

        return Inertia::render('products/create', [
            'categories' => $categories,
            'colors' => $colors,
            'sizes' => $sizes,
        ]);
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $this->productService->store($request->validated());

            return redirect()
                ->route('products.index')
                ->with('success', FlashHelper::stamp('Product successfully created.'));
        } catch (\Throwable $e) {
            Log::error($e);

            return back()->withErrors([
                'error' => FlashHelper::stamp('Failed to create product.'),
            ]);
        }
    }

    public function edit(Product $product)
    {
        $categories = Category::all();

        $sizes = VariantAttribute::where('type', 'size')
            ->when(
                DB::getDriverName() === 'mysql',
                fn ($q) => $q->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ALL')"),
                fn ($q) => $q->orderBy('name')
            )
            ->get();

        $colors = VariantAttribute::where('type', 'color')
            ->where(function ($q) {
                foreach (config('product.colors') as $color) {
                    $q->orWhere(function ($q2) use ($color) {
                        $q2->where('name', $color['name'])
                            ->where('hex', $color['hex']);
                    });
                }
            })
            ->when(
                DB::getDriverName() === 'mysql',
                fn ($q) => $q->orderByRaw("FIELD(name, 'White', 'Black') DESC"),
                fn ($q) => $q->orderBy('name')
            )
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

    public function update(UpdateProductRequest $request, Product $product)
    {

        try {
            $validated = $request->validated();

            // Log::info('REQUEST VARIANTS:', [
            //     'variants_raw' => $validated['variants'] ?? null,
            //     'variants_decoded' => json_decode($validated['variants'] ?? '[]', true),
            // ]);

            $this->productService->update($product, $validated);

            return redirect()
                ->route('products.index')
                ->with('success', FlashHelper::stamp('Product successfully updated.'));
        } catch (\Throwable $e) {
            Log::error($e);

            return back()->withErrors([
                'error' => FlashHelper::stamp('Failed to update product.'),
            ]);
        }
    }

    public function destroy(Product $product)
    {
        $this->productService->delete($product);

        return redirect()
            ->route('products.index')
            ->with('success', FlashHelper::stamp('Product successfully deleted.'));
    }

    // update product status only (published/archived)
    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'is_published' => 'required|boolean',
        ], [
            'is_published.required' => 'Please select the product status.',
        ]);

        $this->productService->updateStatus($product, $validated['is_published']);

        return redirect()
            ->back()
            ->with('success', FlashHelper::stamp('Product successfully updated.'));
    }
}
