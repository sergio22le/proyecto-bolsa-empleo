<?php

namespace App\Http\Controllers;

use App\Models\Titulo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TituloController extends Controller
{
    //Listado de títulos
    public function index()
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        $titulos = Titulo::all();

        $data = [
            "titulos" => $titulos,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    //Crear un nuevo título
    public function store(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="admin")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:45'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $lastId = Titulo::max('id');
        $nextId = $lastId + 1;

        $titulo = Titulo::create([
            "id" => $nextId,
            'nombre' => $request->nombre
        ]);
    
        if (!$titulo) {
            $data = [
                "message" => "Error al crear el título",
                "status" => 500
            ];
            return response()->json($data, 500);
        }
    
        $titulo = Titulo::find($nextId);
        $data = [
            "titulo" => $titulo,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    public function show(string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        $titulo = Titulo::find($id);

        if(!$titulo) {
            $data = [
                "message" => "Titulo no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $data = [
            "titulo" => $titulo,
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }

    public function update(Request $request, string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="admin")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $titulo = Titulo::find($id);

        if(!$titulo) {
            $data = [
                "message" => "Titulo no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:45'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        if($request->has("nombre"))     $titulo->nombre = $request->nombre;

        $titulo->save();
    
        $data = [
            "message" => "Titulo actualizado",
            "titulo" => $titulo,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="admin")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }
        
        $titulo = Titulo::find($id);

        if(!$titulo) {
            $data = [
                "message" => "Titulo no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulo->delete();

        $data = [
            "message" => "Titulo eliminado",
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }
}
