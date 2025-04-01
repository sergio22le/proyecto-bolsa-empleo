<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Empresa;
use App\Models\Demandante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class UserController extends Controller
{
    /**
     * Crear un nuevo usuario
     */
    public function register(Request $request)
    {
        DB::beginTransaction();
        try {
            if ($request->tipo === 'demandante') {
                $request->validate([
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
    
                $user = User::create([
                    'usuario' => $request->usuario,
                    'password' => Hash::make($request->password),
                    'tipo' => $request->tipo,
                ]);
    
                $demandante = Demandante::create([
                    'dni' => $request->dni,
                    'nombre' => $request->nombre,
                    'ape1' => $request->ape1,
                    'ape2' => $request->ape2,
                    'tel_movil' => $request->tel_movil,
                    'email' => $request->email,
                    'situacion' => $request->situacion,
                ]);
    
                DB::table('usuario_demandante')->insert([
                    'idUsuario' => $user->id,
                    'idDemandante' => $demandante->id,
                ]);

            } elseif ($request->tipo === 'empresa') {
                $request->validate([
                    'usuario' => 'required|string|unique:usuarios',
                    'password' => 'required|string|min:6',
                    'cif' => 'required|string|unique:empresa|max:11',
                    'nombre' => 'required|string|max:45',
                    'localidad' => 'required|string|max:45',
                    'telefono' => 'required|digits:9'
                ]);
    
                $user = User::create([
                    'usuario' => $request->usuario,
                    'password' => Hash::make($request->password),
                    'tipo' => $request->tipo,
                ]);
    
                $empresa = Empresa::create([
                    'validado' => 0,
                    'cif' => $request->cif,
                    'nombre' => $request->nombre,
                    'localidad' => $request->localidad,
                    'telefono' => $request->telefono,
                ]);
    
                DB::table('usuario_empresa')->insert([
                    'idUsuario' => $user->id,
                    'idEmpresa' => $empresa->id,
                ]);
            }
    
            DB::commit();
            return response()->json(['message' => 'Usuario y relación creados correctamente'], 201);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear usuario', 'details' => $e->getMessage()], 500);
        }
    }
    

    /**
     * Iniciar sesión con usuario y contraseña
     */
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('usuario', $request->usuario)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        Auth::login($user);

        return response()->json([
            'message' => 'Inicio de sesión exitoso',
            'id' => $user->id,
            'usuario' => $user->usuario,
            'tipo' => $user->tipo,
        ]);
    }

    public function tokens_test()
    {
        $user = User::find(1);
        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $token = $user->createToken('token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function toke_get()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }
        return response()->json([
            'user' => $user
        ]);
    }
}

