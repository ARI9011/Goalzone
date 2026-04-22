<?php

use Illuminate\Support\Facades\Route;
// 1. Importamos el controlador que creamos antes
use App\Http\Controllers\FootballController;

// 2. Cambiamos la función anónima por la llamada al controlador
Route::get('/', [FootballController::class, 'index']);
use App\Http\Controllers\AuthController;

Route::post('/api/register', [AuthController::class, 'register']);
Route::post('/api/login', [AuthController::class, 'login']);