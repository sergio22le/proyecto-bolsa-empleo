<?php

namespace App\Http\Controllers;

use App\Models\Demandante;
use App\Models\Oferta;
use App\Models\UsuarioDemandante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DemandanteController extends Controller
{
    //Lista completa de los demandantes
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

        if($user->tipo != 'admin') {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $demandantes = Demandante::all();

        $data = [
            "demandantes" => $demandantes,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    //NOT_IMPLEMENTED: Añade un demandante
    public function store(Request $request)
    {
        $data = [
            "message" => "Funcion no implementada",
            "status" => 501
        ];
        return response()->json($data, 501);

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

    //Muestra un demandante, sus titulos y sus ofertas inscritas
    public function show(string $id)
    {
        $demandante = Demandante::with('titulos', 'ofertas')->find($id);

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

    //Actualiza la información de un demandante
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

        if($user->tipo != 'demandante') {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_demandante = UsuarioDemandante::find($user->id);
        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($usuario_demandante->idDemandante != $demandante->id) {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
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

    //NOT_IMPLEMENTED: Elimina un demandante
    public function destroy(string $id)
    {
        $data = [
            "message" => "Funcion no implementada",
            "status" => 501
        ];
        return response()->json($data, 501);

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

    //Consultar ofertas disponibles para la titulación
    public function getOfertas(string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo != 'demandante') {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_demandante = UsuarioDemandante::find($user->id);
        $demandante = Demandante::find($id);

        if(!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($usuario_demandante->idDemandante != $demandante->id) {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        // Obtener las ofertas disponibles para el demandante
        $titulos = $demandante->titulos->pluck('id_titulo');
        $ofertas = Oferta::where('abierta', true)->get();
        $ofertasFiltradas = [];
        foreach ($ofertas as $oferta) {
            $titulosOferta = $oferta->titulos->pluck('id');
    
            if($titulos->intersect($titulosOferta)->count())
                $ofertasFiltradas[] = $oferta;
        }

        $data = [
            "ofertas" => $ofertasFiltradas,
            "status" => 200
        ];

        return response()->json($data, 200);
    }
}
