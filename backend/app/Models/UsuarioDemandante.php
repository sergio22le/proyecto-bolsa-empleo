<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioDemandante extends Model
{
    use HasFactory;

    protected $table = 'usuario_demandante';
    public $timestamps = false;

    protected $fillable = [
        'idUsuario',
        'idDemandante'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idUsuario', 'id');
    }

    public function demandante()
    {
        return $this->belongsTo(Demandante::class, 'idDemandante', 'id');
    }
}
