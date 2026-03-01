<?php

namespace App\Services\Admin;

use App\Models\Customization;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class CustomizationService
{
    // Paginate customizations with search and sorting
    public function paginate(array $params): LengthAwarePaginator
    {
        $perPage = $params['per_page'] ?? 10;

        $sort = in_array($params['sort'] ?? '', [
            'created_at',
            'additional_price',
            'is_draft',
            'user_name',
        ]) ? $params['sort'] : 'created_at';

        $direction = ($params['direction'] ?? '') === 'asc' ? 'asc' : 'desc';

        $query = Customization::query()
            ->with(['user', 'product.images', 'productVariant.attributes']);

        $query->when($params['search'] ?? null, function ($q, $search) {
            $q->where('id', 'like', "%{$search}%")
                ->orWhereHas('user', function ($u) use ($search) {
                    $u->where('name', 'like', "%{$search}%");
                })
                ->orWhereHas('product', function ($p) use ($search) {
                    $p->where('name', 'like', "%{$search}%");
                });
        });

        if ($sort === 'user_name') {
            $query->leftJoin('users', 'users.id', '=', 'customizations.user_id')
                ->select('customizations.*')
                ->orderBy('users.name', $direction);
        } else {
            $query->orderBy($sort, $direction);
        }

        $paginator = $query->paginate($perPage)->withQueryString();

        $paginator->through(function ($customization) {

            $baseImages = [];
            if ($customization->product && $customization->product->images) {
                foreach ($customization->product->images as $img) {
                    $key = $img->type;
                    if ($key === 'left') {
                        $key = 'leftSleeve';
                    }
                    if ($key === 'right') {
                        $key = 'rightSleeve';
                    }

                    $baseImages[$key] = $img->path ? asset('storage/'.$img->path) : null;
                }
            }

            $details = is_string($customization->custom_details)
                ? json_decode($customization->custom_details, true)
                : $customization->custom_details;

            $customization->base_images = $baseImages;
            $customization->custom_details = $details;

            return $customization;
        });

        return $paginator;
    }

    public function update(Customization $customization, array $data): bool
    {
        return $customization->update([
            'additional_price' => $data['additional_price'],
            'is_draft' => $data['is_draft'],
        ]);
    }
}
