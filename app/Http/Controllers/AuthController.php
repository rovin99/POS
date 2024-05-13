<?php



namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|string|max:255|unique:users',
            'password' => 'required|string',
        ]); 
        

        $user = User::create([
            'name' => $request->name,
            'user_id' => $request->user_id,
            'password' => Hash::make($request->password),
            'verified' => true,
        ]);

        return response()->json(['message' => 'User registered successfully']);
    }

    public function login(Request $request)
    {
        $request->validate([
            'user_id' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        $user = User::where('user_id', $request->user_id)->first();

        if (!$user ||!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json(['message' => 'User logged in successfully']);
    }
}
