<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = "empresa";
    public $timestamps = false;

    protected $fillable = [
        "id",
        "validado",
        "cif",
        "nombre",
        "localidad",
        "telefono"
    ];

    public function ofertas()
    {
        return $this->hasMany(Oferta::class, 'id_emp', 'id');
    }
}
