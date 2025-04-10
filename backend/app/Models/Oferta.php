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

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_emp', 'id');
    }
    public function titulos()
    {
        return $this->belongsToMany(Titulo::class, 'titulos_oferta', 'id_oferta', 'id_titulo');
    }
    public function demandantes()
    {
        return $this->belongsToMany(Demandante::class, 'apuntados_oferta', 'id_oferta', 'id_demandante');
    }
}
