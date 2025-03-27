<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\DemandanteController;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\TituloController;

//Empresas
Route::patch("/empresas/validate={id}", [EmpresaController::class, "validate"]);
Route::resource('empresas', EmpresaController::class);
//Demandantes
Route::resource('demandantes', DemandanteController::class);
//Ofertas
Route::resource('ofertas', OfertaController::class);
//Titulos
Route::resource('titulos', TituloController::class);