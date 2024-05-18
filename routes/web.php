<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientUserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ImageController;

use App\Http\Middleware\AuthMiddleware;


Route::post('/create-client-user', [ClientUserController::class, 'createClientUser'])->middleware(AuthMiddleware::class);
Route::put('/update-user', [ClientUserController::class, 'updateClientUser'])->middleware(AuthMiddleware::class);
Route::get('/fetch-client-users', [ClientUserController::class, 'fetchClientUsers'])->middleware(AuthMiddleware::class);


Route::post('/create-admin', [AdminController::class, 'createAdmin'])->middleware(AuthMiddleware::class);
Route::get('/logged-in', [AdminController::class, 'checkLoggedIn'])->middleware(AuthMiddleware::class);

Route::post('/comments/add', [CommentController::class, 'add'])->middleware(AuthMiddleware::class);
Route::post('/comments/modify', [CommentController::class, 'modify'])->middleware(AuthMiddleware::class);
Route::get('/comments', [CommentController::class, 'index']);

Route::post('/login', [AdminController::class, 'login']);

Route::get('/transactions', [TransactionController::class, 'getAllTransactions'])->middleware(AuthMiddleware::class);
Route::get('/transactions/user/{userId}', [TransactionController::class, 'getTransactionsByUser'])->middleware(AuthMiddleware::class);
Route::get('/transactions/userType/{userType}', [TransactionController::class, 'getTransactionsByUserType'])->middleware(AuthMiddleware::class);
Route::get('/transactions/latestByUserType', [TransactionController::class, 'getLatestTransactionsByUserType'])->middleware(AuthMiddleware::class);
Route::get('/transactions/user/{userId}/period/', [TransactionController::class, 'getTransactionsByUserAndPeriod'])->middleware(AuthMiddleware::class);
Route::get('/transactionsview', [TransactionController::class, 'index'])->middleware(AuthMiddleware::class);
Route::get('/transactions/transType', [TransactionController::class, 'getTransactionsByTransUser'])->middleware(AuthMiddleware::class);
Route::post('/add-transaction', [TransactionController::class, 'addTransaction'])->middleware(AuthMiddleware::class);


Route::post('/add-image', [ImageController::class, 'addImage'])->middleware(AuthMiddleware::class);

Route::get('/api/items', [ItemController::class , 'index']);
Route::post('/api/items', [ItemController::class , 'store']);
Route::put('/api/items', [ItemController::class , 'update']);
Route::delete('/api/items', [ItemController::class , 'destroy']);
Route::post('api/upload', [ItemController::class, 'upload']);

Route::get('/', function () {
    return view('welcome');
});

// Route::get('/Admin', function () {
//     return view('kk');
// });
Route::post('api/register', [AuthController::class, 'register']);
Route::post('api/login', [AuthController::class, 'login']);


Route::post('/api/bills', [BillController::class, 'store']);
Route::get('/api/bills', [BillController::class, 'index']);


    Route::get('/api/bills/today-sales', [BillController::class, 'getTodaysSales']);
    Route::get('/api/bills/this-week-sales', [BillController::class, 'getThisWeeksSales']);
    Route::get('/api/bills/this-month-sales', [BillController::class, 'getThisMonthsSales']);


    Route::get('/api/items/most-sold', [BillController::class, 'getMostSoldItems']);



    Route::get('/api/bills/monthly-profit', [BillController::class, 'getMonthlyProfit']);
    Route::get('/api/bills/monthly-sales', [BillController::class, 'getMonthlySales']);
    Route::get('/api/items/{itemIdOrName}', [ItemController::class, 'showByIdOrName']);