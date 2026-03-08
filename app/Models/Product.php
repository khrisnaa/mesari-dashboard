<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $guarded = [];

    protected $casts = [
        'is_published' => 'boolean',
        'is_customizable' => 'boolean',
        'is_highlighted' => 'boolean',
        'discount_start_at' => 'datetime',
        'discount_end_at' => 'datetime',
        'custom_additional_price' => 'decimal:2',
        'discount_value' => 'decimal:2',
        'weight' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }

    public function customizations()
    {
        return $this->hasMany(Customization::class);
    }

    public function banners()
    {
        return $this->belongsToMany(Banner::class, 'banner_product');
    }
}
