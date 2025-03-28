<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    public function index()
    {
        $empresas = Empresa::all();

        $data = [
            "empresas" => $empresas,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    public function show($id)
    {
        $empresa = Empresa::find($id);

        if(!$empresa) {
            $data = [
                "message" => "Empresa no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $data = [
            "empresa" => $empresa,
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }

    public function destroy($id)
    {
        $empresa = Empresa::find($id);

        if(!$empresa) {
            $data = [
                "message" => "Empresa no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $empresa->delete();

        $data = [
            "empresa" => "Empresa eliminada",
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }

    //TODO: Auto incremento y validación de datos
    public function store(Request $request)
    {    
        $empresa = Empresa::create([
            "id" => $request->id,
            "validado" => $request->validado,
            "cif" => $request->cif, 
            "nombre" => $request->nombre,
            "localidad" => $request->localidad,
            "telefono" => $request->telefono
        ]);
    
        if (!$empresa) {
            $data = [
                "message" => "Error al crear la empresa",
                "status" => 500
            ];
            return response()->json($data, 500);
        }
    
        $data = [
            "empresa" => $empresa,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    //TODO: Validación de datos
    public function update(Request $request, $id)
    {    
        $empresa = Empresa::find($id);

        if(!$empresa) {
            $data = [
                "message" => "Empresa no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($request->has("cif"))        $empresa->cif = $request->cif;
        if($request->has("nombre"))     $empresa->nombre = $request->nombre;
        if($request->has("localidad"))  $empresa->localidad = $request->localidad;
        if($request->has("telefono"))   $empresa->telefono = $request->telefono;

        $empresa->save();
    
        $data = [
            "message" => "Empresa actualizada",
            "empresa" => $empresa,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }
}
