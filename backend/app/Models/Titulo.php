<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titulo extends Model
{
    use HasFactory;

    protected $table = "titulos";
    public $timestamps = false;

    protected $fillable = [
        "id",
        "nombre"
    ];
}
