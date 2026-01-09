<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

class CategoryService
{
    public function getPaginatedCategories(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;
        $sort = in_array($params['sort'] ?? '', ['name', 'created_at']) ? $params['sort'] : 'created_at';
        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Category::query()
            ->when($params['search'] ?? null, fn($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function upsertCategory(array $data): Category
    {
        $data['slug'] = Str::slug($data['name']);

        // Cari di sampah dulu
        $existing = Category::onlyTrashed()
            ->where('name', $data['name'])
            ->first();

        if ($existing) {
            $existing->restore();
            $existing->update($data);
            return $existing;
        }

        return Category::create($data);
    }

    public function deleteCategory(Category $category): bool
    {
        if ($category->products()->exists()) {
            return false;
        }

        return $category->delete();
    }
}
