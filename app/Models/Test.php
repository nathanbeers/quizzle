<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Test extends Model
{
    use HasFactory;

    protected $table = 'tests';

    protected $fillable = [
        'title',
        'description',
        'questions',
        'user_id',
        'tags',
        'close_date',
    ];

    protected $casts = [
        'questions' => 'array',
        'tags' => 'array',
        'close_date' => 'datetime',
    ];
}
