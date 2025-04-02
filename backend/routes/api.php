<?php

use App\Http\Controllers\LogInController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\DemandanteController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\TituloController;
use App\Http\Controllers\TituloDemandanteController;
use App\Http\Controllers\UserController;


//Empresas
Route::patch('/empresas/validate={id}', [EmpresaController::class, 'validate']); //Validado 1
Route::patch('/empresas/reject={id}', [EmpresaController::class, 'reject']); //Validado -1
Route::resource('empresas', EmpresaController::class);

//Titulos demandantes
Route::resource('demandantes.titulos', TituloDemandanteController::class);
//Demandantes
Route::resource('demandantes', DemandanteController::class);
//Ofertas
Route::post('/ofertas/titulo/', [OfertaController::class, 'addTituloOferta']);
Route::post('/ofertas/iscribir/', [OfertaController::class, 'inscribirOferta']);
Route::patch('/ofertas/adjudicar/', [OfertaController::class, 'adjudicarOferta']);
Route::resource('ofertas', OfertaController::class);
//Titulos
Route::resource('titulos', TituloController::class);
//Usuarios
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::delete('/logout', [UserController::class, 'logout']);
Route::post('/deltoken', [UserController::class, 'removeToken']);

//Testing
Route::get('checktoken', [UserController::class, 'checkToken'])->middleware('auth:sanctum');
