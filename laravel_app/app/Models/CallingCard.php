<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CallingCard extends Model
{
    protected $fillable = [
        'name',
        'email',
        'message',
        'status',
        'ip_address',
        'user_agent',
    ];
}
