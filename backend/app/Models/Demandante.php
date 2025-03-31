<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demandante extends Model
{
    use HasFactory;

    protected $table = "demante";
    public $timestamps = false;

    protected $fillable = [
        'id',
        'dni',
        'nombre',
        'ape1',
        'ape2',
        'tel_movil',
        'email',
        'situacion'
    ];
}
