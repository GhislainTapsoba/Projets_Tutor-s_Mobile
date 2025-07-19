<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::prefix('v1')->group(function () {
    // Services
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/{id}', [ServiceController::class, 'show']);
    
    // Tickets (client)
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::patch('/tickets/{id}/cancel', [TicketController::class, 'cancel']);
    Route::post('/tickets/{id}/rate', [TicketController::class, 'rate']);
    Route::get('/queue', [TicketController::class, 'queue']);
    
    // Authentification agent
    Route::post('/agent/login', [AgentController::class, 'login']);
    
    // Dashboard public (stats générales)
    Route::get('/dashboard/realtime', [DashboardController::class, 'realtimeStatus']);
});

// Routes protégées (agents)
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Agent
    Route::post('/agent/logout', [AgentController::class, 'logout']);
    Route::get('/agent/profile', [AgentController::class, 'profile']);
    Route::patch('/agent/status', [AgentController::class, 'updateStatus']);
    
    // Gestion des tickets (agent)
    Route::post('/agent/call-next', [AgentController::class, 'callNext']);
    Route::patch('/agent/tickets/{id}/start', [AgentController::class, 'startService']);
    Route::patch('/agent/tickets/{id}/complete', [AgentController::class, 'completeService']);
    Route::patch('/agent/tickets/{id}/skip', [AgentController::class, 'skipTicket']);
    
    // Tickets (liste pour agents)
    Route::get('/tickets', [TicketController::class, 'index']);
    
    // Dashboard admin
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'recentActivity']);
    Route::get('/agents/stats', [AgentController::class, 'stats']);
});
