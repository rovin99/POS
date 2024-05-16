<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ClientUser;

class ClientUserController extends Controller
{
    public function fetchClientUsers(Request $request)
{
    $userType = $request->query('userType');

    if ($userType) {
        if($userType=="customer"){
            $userType="client";
        }
        $users = ClientUser::where('userType', $userType)
            ->select([
                'id',
                'name',
                'userType',
                'email',
                'companyName',
                'phoneNumber',
                'address',
                'watch',
                'balanceLimit',
                'blackListed',
                'removed',
                \DB::raw('IFNULL(SUM(transactions.amount), 0) AS balance'),
                \DB::raw('MAX(transactions.transactionDate) AS lastTransactionDate'),
                \DB::raw('COUNT(transactions.amount) AS transactionCount'),
            ])
            ->leftJoin('transactions', 'client_users.id', '=', 'transactions.userId')
            ->groupBy('client_users.id')
            ->get();

        return response()->json($users);
    } else {
        $clientUsers = ClientUser::all();
    }

    return response()->json($clientUsers);
}

    public function createClientUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'userType' => 'required|in:client,supplier,other,own',
            'companyName' => 'required|string',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'nullable|string|email',
            'address' => 'nullable|string',
            'watch' => 'boolean',
            'balanceLimit' => 'required|string|max:30',
            'blackListed' => 'required|boolean',
            'removed' => 'boolean',
        ]);

        $clientUser = new ClientUser;
        $clientUser->userType = $request->userType;
        $clientUser->name = $request->name;
        $clientUser->companyName = $request->companyName;
        $clientUser->phoneNumber = $request->phoneNumber;
        $clientUser->email = $request->email;
        $clientUser->address = $request->address;
        $clientUser->watch = $request->watch ?? false;
        $clientUser->balanceLimit = $request->balanceLimit;
        $clientUser->blackListed = $request->blackListed ?? false;
        $clientUser->removed = $request->removed ?? false;
        $clientUser->save();

        return response()->json(['success' => 'User created successfully'], 201);
    }

    public function updateClientUser(Request $request)
{   $id=$request->input('id');
    $clientUser = ClientUser::findOrFail($id);

    $request->validate([
        
        'phoneNumber' => 'nullable|string|max:20',
        'blacklisted' => 'nullable|boolean',
        'watch' => 'nullable|boolean',
        'balanceLimit' => 'nullable|string|max:30',
    ]);

   
    $clientUser->phoneNumber = $request->input('phoneNumber', $clientUser->phoneNumber);
    
    $clientUser->watch = $request->input('watch', $clientUser->watch);
    $clientUser->balanceLimit = $request->input('balanceLimit', $clientUser->balanceLimit);
    $clientUser->blackListed = $request->input('blacklisted', $clientUser->blackListed);
  

    $clientUser->save();

    return response()->json([
        'success' => 'User updated successfully',
        'user' => $clientUser
    ]);
}
}
