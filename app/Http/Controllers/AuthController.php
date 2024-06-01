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
            'verified' => false,
            'super_admin'=> false
        ]);

        return response()->json(['message' => 'User registered successfully but awaits admin approval']);
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
        if(!$user->verified){
            return response()->json(['message' => 'User not verified'], 401);
        }

        return response()->json(['message' => 'User logged in successfully']);
    }

    public function approveUser(Request $request)
{
    $request->validate([
        'user_id' => 'required|string|max:255',
    ]);

    $user = User::where('user_id', $request->user_id)->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->update(['verified' => true]);

    return response()->json(['message' => 'User approved successfully']);
}
public function getUnverifiedUsers()
{
    $unverifiedUsers = User::where('verified', false)
        ->select('name', 'user_id')
        ->get()
        ->toArray();

    if (count($unverifiedUsers) > 0) {
        return response()->json(['unverified_users' => $unverifiedUsers], 200);
    } else {
        return response()->json(['message' => 'No unverified users found'], 404);
    }
}

}
