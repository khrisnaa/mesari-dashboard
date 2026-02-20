<?php

namespace App\Enums;

enum BannerType: string
{
    case NONE = 'marquee';
    case PRODUCT = 'popup';
    case CATEGORY = 'banner';
    case PRODUCTS = 'products';
    case EXTERNAL = 'external';
}
