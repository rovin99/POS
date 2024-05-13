<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;
    protected $fillable = [
        'customer_name',
        'customer_number',
        'total_amount',
        'sub_total',
        'tax',
        'payment_mode',
        'cart_items',
    ];

    protected $casts = [
        'cart_items' => 'array', // Assuming JSON format for cart items
    ];
}
