<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\DemandanteController;

//Empresas
Route::patch("/empresas/validate={id}", [EmpresaController::class, "validate"]);
Route::resource('empresas', EmpresaController::class);
//Demandante
Route::resource('demandantes', DemandanteController::class);