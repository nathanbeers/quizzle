<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['test_id', 'questions', 'email', 'name'];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
