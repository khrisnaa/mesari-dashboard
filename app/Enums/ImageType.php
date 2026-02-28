<?php

namespace App\Enums;

enum ImageType: string
{
    case GALLERY = 'gallery';
    case THUMBNAIL = 'thumbnail';
    case FRONT = 'front';
    case BACK = 'back';
    case LEFT = 'left';
    case RIGHT = 'right';
}
