<?php

namespace App\Enums;

enum BannerType: string
{
    case NONE = 'none';
    case PRODUCT = 'product';
    case CATEGORY = 'category';
    case PRODUCTS = 'products';
    case EXTERNAL = 'external';
}
