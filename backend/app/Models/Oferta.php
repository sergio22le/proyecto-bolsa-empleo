<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    use HasFactory;

    protected $table = "oferta";
    public $timestamps = false;

    protected $fillable = [
        "id",
        "nombre",
        "fecha_pub",
        "num_puesto",
        "tipo_cont",
        "horario",
        "obs",
        "abierta",
        "fecha_cierre",
        "id_emp"
    ];
}
