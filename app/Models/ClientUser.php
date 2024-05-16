<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientUser extends Model
{
    use HasFactory;

    protected $table = 'client_users';

    protected $fillable = [
        'userType',
        'name',
        'companyName',
        'phoneNumber',
        'email',
        'address',
        'watch',
        'balanceLimit',
        'blackListed',
        'removed',
    ];
}
