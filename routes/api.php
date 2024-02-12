<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tests', TestController::class);
});

Route::middleware('auth:sanctum')->get('/user/tests', [TestController::class, 'indexForUser'])->name('user.tests');
Route::middleware('auth:sanctum')->get('/tests/{id}', [TestController::class, 'show'])->name('user.test.show');
