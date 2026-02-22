<?php

namespace App\Enums;

enum BannerType: string
{
    case NONE = 'none';
    case PRODUCT = 'popup';
    case CATEGORY = 'banner';
    case PRODUCTS = 'products';
    case EXTERNAL = 'external';
}
