<?php

namespace App\Services\Admin;

use App\Models\Banner;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;

class BannerService
{
    // paginate banners with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', ['title', 'created_at', 'sort_order']) ? $params['sort'] : 'sort_order';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Banner::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")->orWhere('description', 'like', "%{$search}%");
            })
            ->when(isset($params['is_published']), function ($q) use ($params) {
                $q->where('is_published', $params['is_published']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    // store a new banner
    public function store(array $data): Banner
    {
        $basePath = 'banners/' . now()->format('Y/m/d');

        $backdropPath = isset($data['backdrop']) && $data['backdrop']
            ? $data['backdrop']->store($basePath, 'public')
            : null;

        $imagePath = isset($data['image']) && $data['image']
            ? $data['image']->store($basePath, 'public')
            : null;

        return Banner::create([
            'title' => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'backdrop_path' => $backdropPath,
            'image_path' => $imagePath,
            'cta_text' => $data['cta_text'] ?? null,
            'cta_link' => $data['cta_link'] ?? null,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $data['is_published'],
            'type' => $data['type'],
        ]);
    }

    // update existing banner
    public function update(Banner $banner, array $data): Banner
    {
        $basePath = 'banners/' . now()->format('Y/m/d');

        // handle backdrop image upload (delete old file if exists)
        if (!empty($data['backdrop'])) {
            if ($banner->backdrop_path) {
                Storage::disk('public')->delete($banner->backdrop_path);
            }

            $path = $data['backdrop']->store($basePath, 'public');

            $banner->backdrop_path = $path;
        }

        // handle main image upload (delete old file if exists)
        if (!empty($data['image'])) {
            if ($banner->image_path) {
                Storage::disk('public')->delete($banner->image_path);
            }

            $path = $data['image']->store($basePath, 'public');

            $banner->image_path = $path;
        }

        $banner->fill([
            'title' => $data['title'] ?? $banner->title,
            'description' => $data['description'] ?? $banner->description,
            'cta_text' => $data['cta_text'] ?? $banner->cta_text,
            'cta_link' => $data['cta_link'] ?? $banner->cta_link,
            'sort_order' => $data['sort_order'] ?? $banner->sort_order,
            'is_published' => $data['is_published'],
            'type' => $data['type'],
        ]);

        $banner->save();

        return $banner;
    }

    // delete banner
    public function delete(Banner $banner): bool|null
    {
        return $banner->delete();
    }
}
