<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    // IMPORTANTE: Tu tabla se llama 'users', Laravel lo sabe,
    // pero debemos decirle qué campos puede llenar.
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role',
    ];

    // Como tu script SQL usa 'password_hash' pero Laravel busca 'password', 
    // añade esto para que no se confunda:
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}