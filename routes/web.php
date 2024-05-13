<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillController;
use App\Http\Controllers\ItemController;

Route::get('/api/items', [ItemController::class , 'index']);
Route::post('/api/items', [ItemController::class , 'store']);
Route::put('/api/items', [ItemController::class , 'update']);
Route::delete('/api/items', [ItemController::class , 'destroy']);

Route::get('/', function () {
    return view('welcome');
});


Route::post('api/register', [AuthController::class, 'register']);
Route::post('api/login', [AuthController::class, 'login']);


Route::post('/api/bills', [BillController::class, 'store']);
Route::get('/api/bills', [BillController::class, 'index']);