<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TituloOferta extends Model
{
    use HasFactory;

    protected $table = 'titulos_oferta';
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_oferta',
        'id_titulo'
    ];

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'id_oferta', 'id');
    }

    public function titulo()
    {
        return $this->belongsTo(Titulo::class, 'id_titulo', 'id');
    }
}
