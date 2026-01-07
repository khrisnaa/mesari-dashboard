<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING   = 'pending';
    case PAID      = 'paid';
    case PACKED    = 'packed';
    case SHIPPED   = 'shipped';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
}
