<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Titulo extends Model
{
    use HasFactory;

    protected $table = "titulos";
    public $timestamps = false;
    protected $primaryKey = 'id';
    

    protected $fillable = [
        "id",
        "nombre"
    ];

    public function ofertas()
    {
        return $this->belongsToMany(Oferta::class, 'titulos_oferta', 'id_titulo', 'id_oferta');
    }
    
    public function demandantes()
    {
        return $this->belongsToMany(Demandante::class, 'titulos_demandante', 'id_titulo', 'id_dem');
    }
}
