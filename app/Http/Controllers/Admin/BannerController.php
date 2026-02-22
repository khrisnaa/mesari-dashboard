<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Banner\StoreBannerRequest;
use App\Http\Requests\Admin\Banner\UpdateBannerRequest;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Services\Admin\BannerService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function __construct(
        protected BannerService $bannerService
    ) {}

    public function index(Request $request)
    {
        $banners = $this->bannerService->paginate($request->all());

        return Inertia::render('banners/index', [
            'banners' => $banners,
            'params' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create()
    {
        $products = Product::all();
        $categories = Category::all();

        return Inertia::render('banners/create', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function store(StoreBannerRequest $request)
    {
        $this->bannerService->store($request->validated());

        return redirect()->route('banners.index')
            ->with('success', 'Banner successfully created.');
    }

    public function edit(Banner $banner)
    {

        $banner->backdrop_path = $banner->backdrop_path
            ? '/storage/'.$banner->backdrop_path
            : null;

        $banner->image_path = $banner->image_path
            ? '/storage/'.$banner->image_path
            : null;

        $products = Product::all();
        $categories = Category::all();

        return Inertia::render('banners/edit', [
            'banner' => $banner,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function update(UpdateBannerRequest $request, Banner $banner)
    {
        $this->bannerService->update($banner, $request->validated());

        return redirect()->route('banners.index')
            ->with('success', 'Banner successfully updated.');
    }

    public function destroy(Banner $banner)
    {
        $this->bannerService->delete($banner);

        return redirect()->back()
            ->with('success', 'Banner successfully deleted.');
    }
}
