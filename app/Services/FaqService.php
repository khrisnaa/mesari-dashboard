<?php

namespace App\Services;

use App\Models\Faq;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FaqService
{
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'question',
            'created_at',
            'sort_order',
        ]) ? $params['sort'] : 'sort_order';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        return Faq::query()
            ->when($params['search'] ?? null, function ($q, $search) {
                $q->where('question', 'like', "%{$search}%")
                    ->orWhere('answer', 'like', "%{$search}%");
            })
            ->when(isset($params['is_published']), function ($q) use ($params) {
                $q->where('is_published', $params['is_published']);
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();
    }

    public function find(string $id): Faq
    {
        return Faq::findOrFail($id);
    }

    public function store(array $data): Faq
    {
        return Faq::create($data);
    }

    public function update(Faq $faq, array $data): bool
    {
        return $faq->update($data);
    }

    public function delete(Faq $faq): bool|null
    {
        return $faq->delete();
    }
}
