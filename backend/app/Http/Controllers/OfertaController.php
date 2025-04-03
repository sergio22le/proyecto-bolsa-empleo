<?php

namespace App\Http\Controllers;

use App\Models\ApuntadoOferta;
use App\Models\Demandante;
use App\Models\Oferta;
use App\Models\TituloOferta;
use App\Models\UsuarioDemandante;
use App\Models\UsuarioEmpresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OfertaController extends Controller
{
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

        $ofertas = Oferta::with(['empresa', 'titulos'])->get();

        $data = [
            "ofertas" => $ofertas,
            "status" => 200
        ];

        return response()->json($data, 200);
    }

    //Crea una oferta
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

        if($user->tipo!="empresa")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_empresa = UsuarioEmpresa::find($user->id);
        $empresa = $usuario_empresa->empresa;

        if($empresa->validado != 1)
        {
            $data = [
                "message" => "La empresa no está validada",
                "empresa" => $usuario_empresa,
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:45',
            'num_puesto' => 'required|integer|max:9999',
            'tipo_cont' => 'required|string|in:mañana,tarde',
            'horario' => 'required|string|max:45',
            'obs' => 'required|string|max:45',
            'fecha_cierre' => 'date|required|after:today',
            'titulos' => 'required|array',
            'titulos.*' => 'integer|exists:titulos,id'
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
            "id_emp" => $empresa->id
        ]);
    
        if (!$oferta) {
            $data = [
                "message" => "Error al crear la oferta",
                "status" => 500
            ];
            return response()->json($data, 500);
        }
        $oferta = Oferta::find($nextId);

        foreach ($request->titulos as $titulo) {
            TituloOferta::create([
                "id_oferta" => $oferta->id,
                "id_titulo" => $titulo
            ]);
        }

        $oferta = Oferta::with(['empresa', 'titulos'])->find($nextId);
        
        $data = [
            "oferta" => $oferta,
            "status" => 201
        ];
    
        return response()->json($data, 201);
    }

    //Muestra una oferta
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

        $oferta = Oferta::with(['empresa', 'titulos'])->find($id);

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

    //NOT_IMPLEMENTED: Actualiza una oferta
    public function update(Request $request, string $id)
    {
        $data = [
            "message" => "Funcion no implementada",
            "status" => 501
        ];
        return response()->json($data, 501);

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


    //NOT_IMPLEMENTED: Elimina una oferta
    public function destroy(string $id)
    {
        $data = [
            "message" => "Funcion no implementada",
            "status" => 501
        ];
        return response()->json($data, 501);

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

    //NOT_IMPLEMENTED: Elimina una oferta
    public function addTituloOferta(Request $request)
    {
        $data = [
            "message" => "Funcion no implementada",
            "status" => 501
        ];
        return response()->json($data, 501);

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

    //Inscribe a un demandante a una oferta
    //La empresa puede incribir y adjudicar demandantes no inscritos
    public function inscribirOferta(Request $request)
    {
        //Autenticación
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        //Validación de datos
        $validator = Validator::make($request->all(), [
            'id_oferta' => 'required|integer|exists:oferta,id',
            'id_demandante' => 'required|integer|exists:demante,id',
            'adjudicada' => 'boolean'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        //Validación de oferta
        $oferta = Oferta::find($request->id_oferta);

        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($oferta->abierta == 0)
        {
            $data = [
                "message" => "La oferta no está abierta",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $adjudicada = "No";
        //Validacion de derechos
        switch ($user->tipo) {
            case 'demandante':
                if(UsuarioDemandante::find($user->id)->demandante->id != $request->id_demandante)
                {
                    $data = [
                        "message" => "Usuario no autorizado",
                        "status" => 403
                    ];
                    return response()->json($data, 403);
                }
                break;
            case 'empresa':
                if (UsuarioEmpresa::find($user->id)->empresa->id != $oferta->id_emp)
                {
                    $data = [
                        "message" => "Empresa no autorizada",
                        "status" => 403
                    ];
                    return response()->json($data, 403);
                }
                if($request->adjudicada == 1)
                {
                    $adjudicada = "Sí";
                }
                break;
            default:
                $data = [
                    "message" => "Usuario no autorizado",
                    "status" => 403
                ];
                return response()->json($data, 403);
        }

        //Demandante
        $demandante = Demandante::find($request->id_demandante);
        if (!$demandante) {
            $data = [
                "message" => "Demandante no encontrado",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        //Validación de apuntado
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

        //El demandante no puede apuntarse si no tiene el título requerido
        $ofertaTitulos = $oferta->titulos->pluck('id');
        $demandanteTitulos = $demandante->titulos->pluck('id_titulo');

        if (!$ofertaTitulos->intersect($demandanteTitulos)->count()) {
            $data = [
                "message" => "El demandante no cumple con los títulos requeridos",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $apuntadoOferta = ApuntadoOferta::create([
            'id_oferta' => $request->id_oferta,
            'id_demandante' => $request->id_demandante,
            'adjudicada' => $adjudicada,
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

    //Adjudica una oferta a un demandante
    public function adjudicarOferta(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="empresa")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_empresa = UsuarioEmpresa::find($user->id);
        $empresa = $usuario_empresa->empresa;

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

        if($oferta->id_emp != $empresa->id) {
            $data = [
                "message" => "Empresa no autorizada",
                "status" => 403
            ];
            return response()->json($data, 403);
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

    //Muestra los demandantes apuntados a una oferta
    public function getPostulantes(string $id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="empresa")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_empresa = UsuarioEmpresa::find($user->id);
        $empresa = $usuario_empresa->empresa;
        $oferta = Oferta::find($id);
        
        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($empresa->id != $oferta->id_emp)
        {
            $data = [
                "message" => "Empresa no autorizada",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $apuntados = ApuntadoOferta::where('id_oferta', $id)->with('demandante')->get();
        
        $data = [
            "postulantes" => $apuntados,
            "status" => 200
        ];
        return response()->json($data, 200);
    }

    //Posibles candidatos a una oferta
    public function getCandidatos($id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="empresa")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_empresa = UsuarioEmpresa::find($user->id);
        $empresa = $usuario_empresa->empresa;
        $oferta = Oferta::find($id);
        
        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($empresa->id != $oferta->id_emp)
        {
            $data = [
                "message" => "Empresa no autorizada",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $titulos = $oferta->titulos->pluck('id');
        $demandantes = Demandante::with('titulos')->get();
        $demandantesFiltrados = [];
        foreach ($demandantes as $demandante) {
            $titulosDemandante = $demandante->titulos->pluck('id_titulo');
    
            if($titulos->intersect($titulosDemandante)->count())
                $demandantesFiltrados[] = $demandante;
        }
        $data = [
            "candidatos" => $demandantesFiltrados,
            "status" => 200
        ];
        return response()->json($data, 200);
    }

    //Cerrar una oferta
    public function cerrarOferta($id)
    {
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            $data = [
                "message" => "Token inválido",
                "status" => 401
            ];
            return response()->json($data, 401);
        }

        if($user->tipo!="empresa")
        {
            $data = [
                "message" => "Usuario no autorizado",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $usuario_empresa = UsuarioEmpresa::find($user->id);
        $empresa = $usuario_empresa->empresa;
        $oferta = Oferta::find($id);
        
        if (!$oferta) {
            $data = [
                "message" => "Oferta no encontrada",
                "status" => 404
            ];
            return response()->json($data, 404);
        }

        if($empresa->id != $oferta->id_emp)
        {
            $data = [
                "message" => "Empresa no autorizada",
                "status" => 403
            ];
            return response()->json($data, 403);
        }

        $oferta->abierta = 0;
        $oferta->save();

        $data = [
            "message" => "Oferta cerrada",
            "status" => 200
        ];
    
        return response()->json($data, 200);
    }
}
