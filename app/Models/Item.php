<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'price', 'category', 'image', 'stock', 'discount'];
    public function bills()
    {
        return $this->belongsToMany(Bill::class)->withPivot('quantity', 'price');
    }
}
