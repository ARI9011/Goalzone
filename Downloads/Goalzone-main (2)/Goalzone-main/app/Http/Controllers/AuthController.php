<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|unique:users,username',
                'email'    => 'required|email|unique:users,email',
                'name'     => 'required',
                'password' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = new User();
            $user->username = $request->username;
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password_hash = $request->password; 

            // Lógica de Admin por correo
            $user->role = str_ends_with($request->email, '@goalzone.com') ? 'admin' : 'user';
            $user->save();

            return response()->json(['status' => 'ok', 'role' => $user->role]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function login(Request $request)
    {
        $user = User::where('username', $request->username)->first();

        if ($user && $user->password_hash === $request->password) {
            return response()->json([
                'status' => 'success',
                'role' => $user->role,
                'name' => $user->name,
                'username' => $user->username
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'Credenciales incorrectas'], 401);
    }
}