<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empresa;
use App\Models\Demandante;
use App\Models\UsuarioDemandante;
use App\Models\UsuarioEmpresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\HasApiTokens;

class UserController extends Controller
{
    /**
     * Crear un nuevo usuario
     */
    public function register(Request $request)
    {
        switch ($request->tipo) {
            //Demandante
            case 'demandante':
                $validator = Validator::make($request->all(), [
                    'usuario' => 'required|string|unique:usuarios',
                    'password' => 'required|string|min:6',
                    'dni' => 'required|string|size:9',
                    'nombre' => 'required|string|max:45',
                    'ape1' => 'required|string|max:45',
                    'ape2' => 'required|string|max:45',
                    'tel_movil' => 'required|digits:9',
                    'email' => 'required|email|max:45',
                    'situacion' => 'required|in:0,1'
                ]);
                // Validar los datos demandante
                if($validator->fails()){
                    $data = [
                        "message" => "Error en la validación de datos",
                        "errors" => $validator->errors(),
                        "status" => 400
                    ];
                    return response()->json($data, 400);
                }
                //Creacion de usuario
                $user = User::create([
                    'usuario' => $request->usuario,
                    'password' => Hash::make($request->password),
                    'tipo' => $request->tipo,
                ]);
                //Usuario no ha podido ser creado
                if (!$user) {
                    $data = [
                        "message" => "Error al crear el usuario",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                //Creacion de demandante
                $demandante = Demandante::create([
                    'dni' => $request->dni,
                    'nombre' => $request->nombre,
                    'ape1' => $request->ape1,
                    'ape2' => $request->ape2,
                    'tel_movil' => $request->tel_movil,
                    'email' => $request->email,
                    'situacion' => $request->situacion,
                ]);
                //Demandante no ha podido ser creado
                if (!$demandante) {
                    $data = [
                        "message" => "Error al crear el demandante",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                //Creacion de la relacion entre usuario y demandante
                $usuario_demandante = UsuarioDemandante::create([
                    'idUsuario' => $user->id,
                    'idDemandante' => $demandante->id,
                ]);
                //Relacion no ha podido ser creada
                if (!$usuario_demandante) {
                    $data = [
                        "message" => "Error al crear la relación entre usuario y demandante",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                //Si todo ha ido bien
                $data = [
                    "message" => "Usuario demandante creado correctamente",
                    "usuario" => $user,
                    "demandante" => $demandante,
                    "usuario_demandante" => $usuario_demandante,
                    "status" => 201
                ];
                return response()->json($data, 201);

            //Empresa
            case 'empresa':
                $validator = Validator::make($request->all(), [
                    'usuario' => 'required|string|unique:usuarios',
                    'password' => 'required|string|min:6',
                    'cif' => 'required|string|unique:empresa|max:11',
                    'nombre' => 'required|string|max:45',
                    'localidad' => 'required|string|max:45',
                    'telefono' => 'required|digits:9'
                ]);
                // Validar los datos empresa
                if($validator->fails()){
                    $data = [
                        "message" => "Error en la validación de datos",
                        "errors" => $validator->errors(),
                        "status" => 400
                    ];
                    return response()->json($data, 400);
                }
                //Creacion de usuario
                $user = User::create([
                    'usuario' => $request->usuario,
                    'password' => Hash::make($request->password),
                    'tipo' => $request->tipo,
                ]);
                //Usuario no ha podido ser creado
                if (!$user) {
                    $data = [
                        "message" => "Error al crear el usuario",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                //Creacion de empresa
                $lastId = Empresa::max('id');
                $nextId = $lastId + 1;
                $empresa = Empresa::create([
                    'id' => $nextId,
                    'validado' => 0,
                    'cif' => $request->cif,
                    'nombre' => $request->nombre,
                    'localidad' => $request->localidad,
                    'telefono' => $request->telefono
                ]);
                //Empresa no ha podido ser creada
                if (!$empresa) {
                    $data = [
                        "message" => "Error al crear la empresa",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                $empresa = Empresa::find($nextId);
                //Creacion de la relacion entre usuario y empresa
                $usuario_empresa = UsuarioEmpresa::create([
                    'idUsuario' => $user->id,
                    'idEmpresa' => $empresa->id
                ]);
                //Relacion no ha podido ser creada
                if (!$usuario_empresa) {
                    $data = [
                        "message" => "Error al crear la relación entre usuario y empresa",
                        "status" => 500
                    ];
                    return response()->json($data, 500);
                }
                //Si todo ha ido bien
                $data = [
                    "message" => "Usuario empresa creado correctamente",
                    "usuario" => $user,
                    "empresa" => $empresa,
                    "usuario_empresa" => $usuario_empresa,
                    "status" => 201
                ];
                return response()->json($data, 201);
            
            //Si el tipo no es ni empresa ni demandante
            default:
                $data = [
                    "message" => "Tipo de usuario no válido",
                    "status" => 400
                ];
                return response()->json($data, 400);
        }
    }
    

    //Usuario administrador: centro - P.Estella
    public function login(Request $request)
    {
        // Validar los datos de entrada
        $validator = Validator::make($request->all(), [
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);
        
        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $user = User::where('usuario', $request->usuario)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        //Obtengo el token
        $token = $user->createToken('token')->plainTextToken;

        // Devolver el token al usuario
        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'token' => $token,
            'id' => $user->id,
            'usuario' => $user->usuario,
            'tipo' => $user->tipo
        ]);
    }

    public function checkToken()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Token inválido'], 401);
        }
        return response()->json([
            'message' => 'Token válido',
            'user' => $user
        ]);
    }
}

