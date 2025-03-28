<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LogInController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:45'
        ]);

        if($validator->fails()){
            $data = [
                "message" => "Error en la validación de datos",
                "errors" => $validator->errors(),
                "status" => 400
            ];
            return response()->json($data, 400);
        }

        $username = $request->username;

        session(["username" => $username]);

        $data = [
            "message" => "Vien benido",
            "usuario" => session("username"),
            "status" => 200
        ];
        return response()->json($data, 200);

        //session(['user_id' => $username->id]); Buscar el id del usuario para manejarlo con la sesion y validaciones
    }
}
