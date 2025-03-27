<?php

namespace App\Http\Controllers;

use App\Models\Oferta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OfertaController extends Controller
{
    public function index()
    {
        $ofertas = Oferta::all();

        $data = [
            "ofertas" => $ofertas,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:45',
            'num_puesto' => 'required|integer|max:9999',
            'tipo_cont' => 'required|string|in:mañana,tarde',
            'horario' => 'required|string|max:45',
            'obs' => 'required|string|max:45',
            'fecha_cierre' => 'date|required|after:today',
            'id_emp' => 'required|integer|exists:empresa,id'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $lastId = Oferta::max('id');
        $nextId = $lastId + 1;

        $oferta = Oferta::create([
            "id" => $nextId,
            "nombre" => $request->nombre,
            "fecha_pub" => now(),
            "num_puesto" => $request->num_puesto,
            "tipo_cont" => $request->tipo_cont,
            "horario" => $request->horario,
            "obs" => $request->obs,
            "abierta" => 1,
            "fecha_cierre" => $request->fecha_cierre,
            "id_emp" => $request->id_emp
        ]);
    
        if (!$oferta) {
            $data = [
                "message" => "Error al crear la oferta",
                "status" => 500
            ];
            return response()->json($data, 500);
        }

        $oferta = Oferta::find($nextId);
        $data = [
            "oferta" => $oferta,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    public function show(string $id)
    {
        $oferta = Oferta::find($id);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $data = [
            "oferta" => $oferta,
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }

    public function update(Request $request, string $id)
    {
        $oferta = Oferta::find($id);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'string|max:45',
            'num_puesto' => 'integer|max:9999',
            'tipo_cont' => 'string|max:45',
            'horario' => 'string|max:45',
            'obs' => 'string|max:45',
            'abierta' => 'integer|in:0,1',
            'fecha_cierre' => 'date',
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        if ($request->has("nombre"))        $oferta->nombre = $request->nombre;
        if ($request->has("num_puesto"))    $oferta->num_puesto = $request->num_puesto;
        if ($request->has("tipo_cont"))     $oferta->tipo_cont = $request->tipo_cont;
        if ($request->has("horario"))       $oferta->horario = $request->horario;
        if ($request->has("obs"))           $oferta->obs = $request->obs;
        if ($request->has("abierta"))       $oferta->abierta = $request->abierta;
        if ($request->has("fecha_cierre"))  $oferta->fecha_cierre = $request->fecha_cierre;

        $oferta->save();

        $data = [
            "message" => "Oferta actualizada",
            "oferta" => $oferta,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        $oferta = Oferta::find($id);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $oferta->delete();

        $data = [
            "message" => "Oferta eliminada",
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }
}
