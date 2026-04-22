<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;      // Importamos el modelo de partidos
use App\Models\Standing;  // Importamos el de posiciones
use App\Models\Scorer;    // Importamos el de goleadores

class FootballController extends Controller
{
    public function index()
    {
        // 1. Traer todos los partidos de la tabla 'matches'
        $matches = Game::all();

        // 2. Traer las clasificaciones ordenadas por puntos (descendente)
        $standings = Standing::orderBy('points', 'desc')->get();

        // 3. Traer los goleadores ordenados por goles
        $scorers = Scorer::orderBy('goals', 'desc')->get();

        // 4. Mandar todo a la vista 'welcome'
        return view('welcome', [
            'matches'   => $matches,
            'standings' => $standings,
            'scorers'   => $scorers
        ]);
    }
}