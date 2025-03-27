<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TituloDemandante extends Model
{
    use HasFactory;

    protected $table = "titulos_demandante";
    protected $primaryKey = ['id_dem', 'id_titulo'];
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        "id_dem",
        "id_titulo",
        "centro",
        "año",
        "cursando"
    ];
}
