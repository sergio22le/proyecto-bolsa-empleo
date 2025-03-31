<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Crear un nuevo usuario
     */
    public function register(Request $request)
    {
        // Validar los datos
        $request->validate([
            'usuario' => 'required|string|unique:usuarios',
            'password' => 'required|string|min:6',
        ]);

        // Crear usuario con contraseña encriptada
        $user = User::create([
            'usuario' => $request->usuario,
            'password' => Hash::make($request->password), // Hash de la contraseña
            'tipo' => $request->tipo,
        ]);

        return response()->json(['message' => 'Usuario creado correctamente', 'user' => $user], 201);
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

        return response()->json(['message' => 'Inicio de sesión exitoso', 'user' => $user]);
    }
}

