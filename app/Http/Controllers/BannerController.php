<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Services\BannerService;
use App\Http\Requests\Banner\StoreBannerRequest;
use App\Http\Requests\Banner\UpdateBannerRequest;
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
        return Inertia::render('banners/create');
    }

    public function store(StoreBannerRequest $request)
    {
        $this->bannerService->store($request->validated());

        return redirect()->route('banners.index')
            ->with('success', 'Banner successfully created.');
    }

    public function edit(Banner $banner)
    {
        return Inertia::render('banners/edit', [
            'banner' => $banner,
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

        return redirect()->route('banners.index')
            ->with('success', 'Banner successfully deleted.');
    }
}
