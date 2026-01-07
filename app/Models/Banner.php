<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
{
    use HasUuids, SoftDeletes;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
