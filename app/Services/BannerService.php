<?php

namespace App\Services;

use App\Models\Banner;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BannerService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'title',
            'created_at',
            'sort_order',
        ]) ? $params['sort'] : 'sort_order';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Banner::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when(isset($params['is_active']), function ($q) use ($params) {
                $q->where('is_active', $params['is_active']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function store(array $data): Banner
    {
        return Banner::create($data);
    }

    public function update(Banner $banner, array $data): bool
    {
        return $banner->update($data);
    }

    public function delete(Banner $banner): bool|null
    {
        return $banner->delete();
    }
}
