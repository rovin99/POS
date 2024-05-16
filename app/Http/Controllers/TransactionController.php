<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class TransactionController extends Controller
{
    public function getAllTransactions()
    {
        $transactions = Transaction::all();
        return response()->json($transactions);
    }

    public function getTransactionsByUser($userId)
    {
        $transactions = Transaction::where('userId', $userId)->get();
        return response()->json($transactions);
    }
    public function getTransactionsByTransUser(Request $request)
    {   $transactionType = $request->input('transType');
        $transactions = Transaction::where('transactionType', $transactionType)->get();
        return response()->json($transactions);
    }
    
    public function getTransactionsByUserType($userType)
    {    \Log::info($userType);
        $userIds = DB::table('client_users')->where('userType', $userType)->pluck('id');
        \Log::info('User IDs:', $userIds->toArray());
        $transactions = Transaction::whereIn('userId', $userIds)->get();
        \Log::info('Transactions:', $transactions->toArray()); 
        return response()->json($transactions);
    }

    public function getLatestTransactionsByUserType(Request $request)
    {
        $userType = $request->input('userType');
        \Log::info($userType);
        if ($userType !== null) {
            $today = date('Y-m-d');

            $transactions = DB::table('transactions as t')
                ->join('client_users as u', 't.userId', '=', 'u.id')
                ->where('u.userType', $userType)
                ->whereDate('t.logDate', $today)
                ->select(
                    'u.name',
                    'u.phoneNumber',
                    't.transactionId',
                    't.transactionDate',
                    't.description',
                    't.transactionDueDate',
                    't.imageUrl',
                    't.transactionType',
                    't.amount',
                    DB::raw('(SELECT SUM(amount) FROM luxcammy_com_db.transactions WHERE userId = u.id) AS balance')
                )
                ->orderByDesc('t.logDate')
                ->orderByDesc('t.transactionId')
                ->get();

            return response()->json($transactions);
        } else {
            return response()->json(['error' => 'User type not specified'], 400);
        }
    }
    public function getTransactionsByUserAndPeriod($userId, Request $request)
{
    $period = $request->input('period');
    if ($period === null) {
        return response()->json(['error' => 'Period must be specified'], 400);
    }

    $startDate = null;
    $endDate = null;

    switch ($period) {
        case 'all':
            $startDate = Transaction::min('transactionDate');
            $endDate = now();
            break;
        case '30d':
            $startDate = now()->subDays(30);
            $endDate = now()->addDay(); // add a day to include today
            break;
        case '3m':
            $startDate = now()->subMonths(3);
            $endDate = now()->addDay(); // add a day to include today
            break;
        case '6m':
            $startDate = now()->subMonths(6);
            $endDate = now()->addDay(); // add a day to include today
            break;
        case '1yr':
            $startDate = now()->subYear();
            $endDate = now()->addDay(); // add a day to include today
            break;
        default:
            return response()->json(['error' => 'Invalid period specified'], 400);
    }

    \Log::info('Start Date: ' . $startDate);
    \Log::info('End Date: ' . $endDate);

    // Fetch total balance for the user
    $totalBalance = Transaction::where('userId', $userId)->sum('amount');

    // Fetch transactions for the selected period
    $transactions = Transaction::where('userId', $userId)
        ->whereDate('transactionDate', '>=', $startDate)
        ->whereDate('transactionDate', '<=', $endDate)
        ->orderBy('transactionDate', 'desc')
        ->orderBy('transactionId', 'desc')
        ->get();

   
    $currentBalance = $totalBalance;
    foreach ($transactions as $transaction) {
        
        $transaction->balance = $currentBalance;
       
        $currentBalance -= $transaction->amount;
    }

    return response()->json($transactions);
}

public function index(Request $request)
{
    $userType = $request->get('userType');
    $userId = $request->get('userId');
    $period = $request->get('period', '1 days');

    if ($userType !== null) {
        $endDate = date('Y-m-d');
        $startDate = date('Y-m-d', strtotime($endDate . ' - ' . $period));

        $transactions = Transaction::join('client_users', 'transactions.userId', '=', 'client_users.id')
            ->where('client_users.userType', $userType)
            ->whereBetween('transactions.transactionDate', [$startDate, $endDate]);

        if ($userId) {
            $transactions->where('client_users.id', $userId);
        }

        $transactions = $transactions->orderBy('transactions.logDate', 'desc')
            ->orderBy('transactions.transactionId', 'desc')
            ->select('transactions.*') // Select only columns from the transactions table
            ->get();

        return response()->json($transactions);
    } else {
        return response()->json(['error' => 'User type not specified'], 400);
    }
}
public function addTransaction(Request $request)
    {
        $request->validate([
            'userId' => 'required|integer',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'transactionType' => 'required|string',
            'transactionDate' => 'required|date',
            'transactionDueDate' => 'nullable|date',
            
        ]);

        $transaction = new Transaction;
        $transaction->userId = $request->userId;
        $transaction->amount = $request->amount;
        $transaction->description = $request->description;
        $transaction->transactionType = $request->transactionType;
        $transaction->transactionDate = $request->transactionDate;
        $transaction->transactionDueDate = $request->transactionDueDate;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $imagePath = 'images/' . $imageName;
            $image->move(public_path('images'), $imageName);
            $transaction->imageUrl = $imagePath;
        }
        

        $transaction->save();

        return response()->json([
            'success' => true,
            'message' => 'Transaction added successfully',
            'imageUrl' => $transaction->imageUrl,
        ]);
    }

}