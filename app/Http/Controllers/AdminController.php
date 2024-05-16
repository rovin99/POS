<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\AdminUser; // Assuming you have an AdminUser model

class AdminController extends Controller
{
    public function createAdmin(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50',
            'password' => 'required|string|min:8',
            'email' => 'required|string|email|max:100',
            'adminType' => 'string|max:50',
            'phoneNumber' => 'string|max:15',
        ]);

        $adminUser = new AdminUser;
        $adminUser->username = $request->username;
        $adminUser->password = Hash::make($request->password);
        $adminUser->email = $request->email;
        $adminUser->adminType = $request->adminType ?? 'defaultType';
        $adminUser->phoneNumber = $request->phoneNumber;
        $adminUser->save();

        return response()->json(['success' => 'Admin user created successfully']);
    }

    public function checkLoggedIn(Request $request)
    {
        if (auth()->check()) {
            return response()->json([
                'isLoggedIn' => true,
                'username' => auth()->user()->username,
            ]);
        } else {
            return response()->json(['isLoggedIn' => false]);
        }
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|max:255',
            'password' => 'required|string',
        ]);

        $user = AdminUser::where('email', $request->email)->first();

        if (!$user ||!Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
        ]);
    }
}
