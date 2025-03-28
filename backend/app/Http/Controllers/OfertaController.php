<?php

namespace App\Http\Controllers;

use App\Models\ApuntadoOferta;
use App\Models\Demandante;
use App\Models\Oferta;
use App\Models\TituloOferta;
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

    public function addTituloOferta(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_oferta' => 'required|integer|exists:oferta,id',
            'id_titulo' => 'required|integer|exists:titulos,id'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $oferta_titulo = TituloOferta::where('id_oferta', $request->id_oferta)
                                  ->where('id_titulo', $request->id_titulo);

        if($oferta_titulo->first())
        {
            $data = [
                "message" => "La oferta ya contiene el título",
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $new_oferta_titulo = TituloOferta::create([
            "id_oferta" => $request->id_oferta,
            "id_titulo" => $request->id_titulo
        ]);

        $data = [
            "message" => "Título añadido a la oferta",
            "titulo_oferta" => $new_oferta_titulo,
            "status" => 200
        ];
        return response()->json($data, 200);
    }

    public function inscribirOferta(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_oferta' => 'required|integer|exists:oferta,id',
            'id_demandante' => 'required|integer|exists:demante,id'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }
        
        $oferta = Oferta::find($request->id_oferta);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $demandante = Demandante::find($request->id_demandante);

        if (!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $apuntado = ApuntadoOferta::where('id_oferta', $request->id_oferta)
                                  ->where('id_demandante', $request->id_demandante)
                                  ->first();

        if ($apuntado) {
            $data = [
                "message" => "El demandante ya está apuntado a la oferta",
                "status" => 404
            ];
            return response()->json($data, 400);
        }

        $apuntadoOferta = ApuntadoOferta::create([
            'id_oferta' => $request->id_oferta,
            'id_demandante' => $request->id_demandante,
            'adjudicada' => "No",
            'fecha' => now()
            
        ]);

        $data = [
            "message" => "Demandante apuntado a la oferta",
            "apuntado" => $apuntadoOferta,
            "oferta" => $oferta,
            "demdandante" => $demandante,
            "status" => 201
        ];
        return response()->json($data, 201);
    }

    public function adjudicarOferta(Request $request)
    {
        $oferta = Oferta::find($request->id_oferta);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $demandante = Demandante::find($request->id_demandante);

        if (!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        $apuntado = ApuntadoOferta::where('id_oferta', $request->id_oferta)
                                  ->where('id_demandante', $request->id_demandante);

        if (!$apuntado->first()) {
            $data = [
                "message" => "Demandante no apuntado a la oferta",
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        if ($apuntado->first()->adjudicada == "Sí") {
            $data = [
                "message" => "Demandante ya adjudicado",
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $apuntado->update(['adjudicada' => "Sí"]);

        return response()->json(["message" => "Oferta adjudicada al demandante", "status" => 200], 200);
    }
}
