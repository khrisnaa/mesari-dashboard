<?php

namespace App\Services\Admin;

use App\Models\Testimonial;
use Illuminate\Pagination\LengthAwarePaginator;

class TestimonialService
{
    // paginate testimonial with optional search, filters, and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'name',
            'role',
            'created_at',
            'sort_order',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Testimonial::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('role', 'like', "%{$search}%");
            })
            ->when(isset($params['is_published']), function ($q) use ($params) {
                $q->where('is_published', $params['is_published']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    // create a testimonial
    public function store(array $data): Testimonial
    {
        return Testimonial::create($data);
    }

    // update a testimonial
    public function update(Testimonial $testimonial, array $data): bool
    {
        return $testimonial->update($data);
    }

    // delete a testimonial
    public function delete(Testimonial $testimonial): bool|null
    {
        return $testimonial->delete();
    }
}
