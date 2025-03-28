<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApuntadoOferta extends Model
{
    use HasFactory;

    protected $table = 'apuntados_oferta';
    protected $primaryKey = ['id_oferta', 'id_demandante'];
    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'id_oferta',
        'id_demandante',
        'adjudicada',
        'fecha'
    ];

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'id_oferta', 'id');
    }

    public function demandante()
    {
        return $this->belongsTo(Demandante::class, 'id_demandante', 'id');
    }
}
