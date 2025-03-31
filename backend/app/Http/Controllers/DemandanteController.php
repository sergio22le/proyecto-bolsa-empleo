<?php

namespace App\Http\Controllers;

use App\Models\Demandante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DemandanteController extends Controller
{
    public function index()
    {
        $demandantes = Demandante::all();

        $data = [
            "demandantes" => $demandantes,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        
        $validator = Validator::make($request->all(), [
            'dni' => 'required|string|size:9',
            'nombre' => 'required|string|max:45',
            'ape1' => 'required|string|max:45',
            'ape2' => 'required|string|max:45',
            'tel_movil' => 'required|digits:9',
            'email' => 'required|email|max:45',
            'situacion' => 'required|in:0,1'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $demandante = Demandante::create([
            'dni' => $request->dni,
            'nombre' => $request->nombre,
            'ape1' => $request->ape1,
            'ape2' => $request->ape2,
            'tel_movil' => $request->tel_movil,
            'email' => $request->email,
            'situacion' => $request->situacion,
        ]);
    
        if (!$demandante) {
            $data = [
                "message" => "Error al crear el demandante",
                "status" => 500
            ];
            return response()->json($data, 500);
        }

        $data = [
            "demandante" => $demandante,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    public function show(string $id)
    {
        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $data = [
            "demandante" => $demandante,
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }

    public function update(Request $request, string $id)
    {
        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'dni' => 'string|size:9',
            'nombre' => 'string|max:45',
            'ape1' => 'string|max:45',
            'ape2' => 'string|max:45',
            'tel_movil' => 'digits:9',
            'email' => 'email|max:45',
            'situacion' => 'required|in:0,1'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        if($request->has("dni"))        $demandante->dni = $request->dni;
        if($request->has("nombre"))     $demandante->nombre = $request->nombre;
        if($request->has("ape1"))       $demandante->ape1 = $request->ape1;
        if($request->has("ape2"))       $demandante->ape2 = $request->ape2;
        if($request->has("tel_movil"))  $demandante->tel_movil = $request->tel_movil;
        if($request->has("email"))      $demandante->email = $request->email;
        if($request->has("situacion"))  $demandante->situacion = $request->situacion;

        $demandante->save();
    
        $data = [
            "message" => "Demandante actualizado",
            "demandante" => $demandante,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $demandante->delete();

        $data = [
            "message" => "Demandante eliminado",
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }
}
