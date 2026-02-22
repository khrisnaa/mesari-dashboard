<?php

namespace App\Services\Admin;

use App\Enums\BannerType;
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

    public function store(array $data): Banner
    {
        $basePath = 'banners/'.now()->format('Y/m/d');

        $backdropPath = isset($data['backdrop']) && $data['backdrop']
            ? $data['backdrop']->store($basePath, 'public')
            : null;

        $imagePath = isset($data['image']) && $data['image']
            ? $data['image']->store($basePath, 'public')
            : null;

        $ctaType = $data['cta_type'];
        $ctaLink = null;
        $ctaTargetId = null;

        if ($ctaType === BannerType::EXTERNAL->value) {

            $ctaLink = $data['cta_link'] ?? null;
        } elseif (in_array($ctaType, [BannerType::PRODUCT->value, BannerType::CATEGORY->value])) {

            $ctaTargetId = $data['cta_target_id'] ?? null;
        }

        $banner = Banner::create([
            'title' => $data['title'] ?? null,
            'description' => $data['description'] ?? null,
            'backdrop_path' => $backdropPath,
            'image_path' => $imagePath,
            'cta_text' => $data['cta_text'] ?? null,
            'cta_link' => $ctaLink,
            'cta_target_id' => $ctaTargetId,
            'sort_order' => $data['sort_order'] ?? 0,
            'is_published' => $data['is_published'] ?? false,
            'cta_type' => $ctaType,
        ]);

        if ($ctaType === BannerType::PRODUCTS->value && ! empty($data['product_ids'])) {
            $banner->products()->sync($data['product_ids']);
        }

        return $banner;
    }

    // update existing banner
    public function update(Banner $banner, array $data): Banner
    {
        $basePath = 'banners/'.now()->format('Y/m/d');

        if (! empty($data['backdrop'])) {
            if ($banner->backdrop_path) {
                Storage::disk('public')->delete($banner->backdrop_path);
            }
            $banner->backdrop_path = $data['backdrop']->store($basePath, 'public');
        }

        if (! empty($data['image'])) {
            if ($banner->image_path) {
                Storage::disk('public')->delete($banner->image_path);
            }
            $banner->image_path = $data['image']->store($basePath, 'public');
        }

        $ctaType = $data['cta_type'] ?? $banner->cta_type;
        $ctaLink = null;
        $ctaTargetId = null;

        if ($ctaType === BannerType::EXTERNAL->value) {

            $ctaLink = array_key_exists('cta_link', $data) ? $data['cta_link'] : $banner->cta_link;
        } elseif (in_array($ctaType, [BannerType::PRODUCT->value, BannerType::CATEGORY->value])) {
            $ctaTargetId = array_key_exists('cta_target_id', $data) ? $data['cta_target_id'] : $banner->cta_target_id;
        }

        $banner->fill([
            'title' => array_key_exists('title', $data) ? $data['title'] : $banner->title,
            'description' => array_key_exists('description', $data) ? $data['description'] : $banner->description,
            'cta_text' => array_key_exists('cta_text', $data) ? $data['cta_text'] : $banner->cta_text,
            'cta_link' => $ctaLink,
            'cta_target_id' => $ctaTargetId,
            'sort_order' => $data['sort_order'] ?? $banner->sort_order,
            'is_published' => $data['is_published'] ?? $banner->is_published,
            'cta_type' => $ctaType,
        ]);

        $banner->save();

        if ($ctaType === BannerType::PRODUCTS->value) {

            if (isset($data['product_ids'])) {
                $banner->products()->sync($data['product_ids']);
            }
        } else {

            $banner->products()->detach();
        }

        return $banner;
    }

    // delete banner
    public function delete(Banner $banner): ?bool
    {
        return $banner->delete();
    }
}
