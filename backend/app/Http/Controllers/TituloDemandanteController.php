<?php

namespace App\Http\Controllers;

use App\Models\Demandante;
use App\Models\Titulo;
use App\Models\TituloDemandante;
use App\Models\UsuarioDemandante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TituloDemandanteController extends Controller
{
    //Lista completa de los títulos de un demandante
    public function index(string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo == 'empresa' || ($user->tipo == 'demandante' && UsuarioDemandante::find($user->id)->idDemandante != $id))
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulos = TituloDemandante::where('id_dem', $id)->get();

        $data = [
            "demandante" => $demandante,
            "titulos" => $titulos,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    //Añade un título a un demandante
    public function store(string $id, Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo != 'demandante' || UsuarioDemandante::find($user->id)->idDemandante != $id)
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandante = Demandante::find($id);
        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'id_titulo' => 'required|integer|exists:titulos,id',
            'centro' => 'required|string|max:45',
            'año' => 'required|integer|max:2100',
            'cursando' => 'required|string|in:Sí,No'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $exists = TituloDemandante::where('id_dem', $id)->where('id_titulo', $request->id_titulo)->exists();

        if ($exists) {
            $data = [
                "message" => "El demandante ya tiene este título registrado",
                "status" => 409
            ];
            return response()->json($data, 409);
        }

        $titulo = TituloDemandante::create([
            'id_dem' => $id,
            'id_titulo' => $request->id_titulo,
            'centro' => $request->centro,
            'año' => $request->año,
            'cursando' => $request->cursando
        ]);
    
        if (!$titulo) {
            $data = [
                "message" => "Error al crear el título",
                "status" => 500
            ];
            return response()->json($data, 500);
        }

        $data = [
            "titulo" => $titulo,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    //Muestra un título de un demandante
    public function show(string $dem, string $tit)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo != 'demandante' || UsuarioDemandante::find($user->id)->idDemandante != $dem)
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandante = Demandante::find($dem);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulo = TituloDemandante::where('id_dem', $dem)->where("id_titulo", $tit)->first();

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

        return response()->json($data, 200);
    }

    public function update(Request $request, string $dem, string $tit)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo != 'demandante' || UsuarioDemandante::find($user->id)->idDemandante != $dem)
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandante = Demandante::find($dem);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulo = TituloDemandante::where('id_dem', $dem)->where('id_titulo', $tit)->first();

        if(!$titulo) {
            $data = [
                "message" => "Titulo no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'id_titulo' => 'integer|exists:titulos,id',
            'centro' => 'string|max:45',
            'año' => 'integer|max:2100',
            'cursando' => 'string|in:Sí,No'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        if($request->id_titulo!=$tit)
        {
            $exists = TituloDemandante::where('id_dem', $dem)->where('id_titulo', $request->id_titulo)->exists();

            if ($exists) {
                $data = [
                    "message" => "El demandante ya tiene este título registrado",
                    "status" => 409
                ];
                return response()->json($data, 409);
            }
        }

        TituloDemandante::where('id_dem', $dem)
                ->where('id_titulo', $tit)
                ->update($request->only(['id_titulo', 'centro', 'año', 'cursando']));

        $titulo = TituloDemandante::where('id_dem', $dem)->where('id_titulo', $request->id_titulo)->first();
    
        $data = [
            "message" => "Título actualizado",
            "titulo" => $titulo,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }

    public function destroy(string $dem, string $tit)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo != 'demandante' || UsuarioDemandante::find($user->id)->idDemandante != $dem)
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandante = Demandante::find($dem);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulo = TituloDemandante::where('id_dem', $dem)->where('id_titulo', $tit);

        if(!$titulo->exists()) {
            $data = [
                "message" => "Titulo no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $titulo->delete();

        $data = [
            "message" => "Título eliminado",
            "status" => 200
        ];
    
        return response()->json($data, 201);
    }
}
