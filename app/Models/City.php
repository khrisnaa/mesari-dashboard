<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    protected $keyType = 'int';
    public $incrementing = false;

    protected $guarded = [];

    public function addresses()
    {
        return $this->hasMany(UserAddress::class, 'city_id');
    }
}
