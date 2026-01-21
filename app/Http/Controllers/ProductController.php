<?php

namespace App\Http\Controllers;

use App\Helpers\FlashHelper;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    // display a paginated list of product
    public function index(Request $request)
    {
        $products = $this->productService->paginate($request->all());

        return Inertia::render('products/index', [
            'products' => $products,
            'params'  => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    // show form to create a new product
    public function create()
    {
        $categories = Category::all();

        $sizes = Attribute::where('type', 'size')
            ->when(
                DB::getDriverName() === 'mysql',
                fn($q) =>
                $q->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ALL')"),
                fn($q) =>
                $q->orderBy('name')
            )
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
            ->when(
                DB::getDriverName() === 'mysql',
                fn($q) =>
                $q->orderByRaw("FIELD(name, 'White', 'Black') DESC"),
                fn($q) =>
                $q->orderBy('name')
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
                'error' => FlashHelper::stamp('Failed to create product.')
            ]);
        }
    }


    public function edit(Product $product)
    {
        $categories = Category::all();

        $sizes = Attribute::where('type', 'size')
            ->when(
                DB::getDriverName() === 'mysql',
                fn($q) =>
                $q->orderByRaw("FIELD(name, 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'ALL')"),
                fn($q) =>
                $q->orderBy('name')
            )
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
            ->when(
                DB::getDriverName() === 'mysql',
                fn($q) =>
                $q->orderByRaw("FIELD(name, 'White', 'Black') DESC"),
                fn($q) =>
                $q->orderBy('name')
            )
            ->get();

        $product = Product::with(['category', 'variants.attributes', 'images', 'discount'])
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
            $this->productService->update($product, $request->validated());

            return redirect()
                ->route('products.index')
                ->with('success', FlashHelper::stamp('Product successfully updated.'));
        } catch (\Throwable $e) {
            Log::error($e);

            return back()->withErrors([
                'error' => FlashHelper::stamp('Failed to update product.')
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

    public function updateStatus(Request $request, Product $product)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive,draft,archived',
        ]);

        $product->update([
            'status' => $validated['status'],
        ]);

        return redirect()
            ->back()
            ->with('success', FlashHelper::stamp('Product successfully updated.'));
    }
}
