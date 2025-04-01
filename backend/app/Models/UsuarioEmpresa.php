<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuarioEmpresa extends Model
{
    use HasFactory;

    protected $table = 'usuario_empresa';
    public $timestamps = false;
    protected $primaryKey = 'idUsuario';

    protected $fillable = [
        'idUsuario',
        'idEmpresa'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'idUsuario', 'id');
    }

    public function empresa()
    {
        return $this->belongsTo(Demandante::class, 'idEmpresa', 'id');
    }
}
