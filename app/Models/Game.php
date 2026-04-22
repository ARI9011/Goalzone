<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    // 1. Le decimos el nombre exacto de la tabla en MySQL
    protected $table = 'matches';

    // 2. Definimos las columnas que Laravel puede "tocar"
    protected $fillable = [
        'home_team', 
        'away_team', 
        'goals_home', 
        'goals_away', 
        'league', 
        'match_date', 
        'status'
    ];

}