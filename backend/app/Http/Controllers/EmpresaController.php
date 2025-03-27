<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Empresa;
use Illuminate\Support\Facades\Validator;

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
            "message" => "Empresa eliminada",
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }

    public function store(Request $request)
    {    
        $validator = Validator::make($request->all(), [
            'cif' => 'required|string|unique:empresa|max:11',
            'nombre' => 'required|string|max:45',
            'localidad' => 'required|string|max:45',
            'telefono' => 'required|digits:9'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $lastId = Empresa::max('id');
        $nextId = $lastId + 1;

        $empresa = Empresa::create([
            "id" => $nextId,
            'validado' => 0,
            'cif' => $request->cif,
            'nombre' => $request->nombre,
            'localidad' => $request->localidad,
            'telefono' => $request->telefono
        ]);
    
        if (!$empresa) {
            $data = [
                "message" => "Error al crear la empresa",
                "status" => 500
            ];
            return response()->json($data, 500);
        }
    
        $empresa = Empresa::find($nextId);
        $data = [
            "empresa" => $empresa,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

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

        $validator = Validator::make($request->all(), [
            'cif' => 'string|unique:empresa,cif,' . $id . '|max:11', //Para no comprobar que el cif es el suyo
            'nombre' => 'string|max:45',
            'localidad' => 'string|max:45',
            'telefono' => 'digits:9'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
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

    public function validate(Request $request, $id)
    {
        $admin = $request->username;
        if($admin!="centro")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $empresa = Empresa::find($id);
        if(!$empresa) {
            $data = [
                "message" => "Empresa no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($empresa->validado == 1)
        {
            $data = [
                "message" => "La empresa ya se encuentra validada.",
                "status" => 409
            ];
            return response()->json($data, 409);
        }

        $empresa->validado = 1;

        $empresa->save();
    
        $data = [
            "message" => "Empresa validada con éxito",
            "empresa" => $empresa,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }
}
