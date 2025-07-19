<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AgentController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $agent = Agent::where('email', $request->email)->first();

        if (!$agent || !Hash::check($request->password, $agent->password)) {
            return response()->json([
                'error' => 'Identifiants incorrects.'
            ], 401);
        }

        $token = $agent->createToken('agent-token')->plainTextToken;

        $agent->update([
            'status' => 'active',
            'last_activity' => now(),
        ]);

        return response()->json([
            'agent' => $agent,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $agent = Auth::user();
        $agent->update(['status' => 'offline']);
        $agent->tokens()->delete();

        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function profile()
    {
        $agent = Auth::user();
        $agent->load(['currentTicket.service']);

        return response()->json([
            'agent' => $agent,
            'stats' => [
                'today_tickets' => $agent->todayTickets()->count(),
                'average_service_time' => $agent->average_service_time,
                'satisfaction_rate' => $agent->satisfaction_rate,
            ],
        ]);
    }

    public function updateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|in:active,pause,offline',
        ]);

        $agent = Auth::user();
        $agent->update([
            'status' => $request->status,
            'last_activity' => now(),
        ]);

        return response()->json(['message' => 'Statut mis à jour.']);
    }

    public function callNext(Request $request)
    {
        $agent = Auth::user();

        // Vérifier si l'agent a déjà un ticket en cours
        if ($agent->currentTicket) {
            return response()->json([
                'error' => 'Vous avez déjà un ticket en cours.'
            ], 422);
        }

        // Trouver le prochain ticket en attente
        $nextTicket = Ticket::where('status', 'waiting')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at')
            ->first();

        if (!$nextTicket) {
            return response()->json([
                'error' => 'Aucun ticket en attente.'
            ], 404);
        }

        $nextTicket->update([
            'agent_id' => $agent->id,
            'status' => 'called',
            'called_at' => now(),
        ]);

        $nextTicket->load(['service']);

        return response()->json([
            'ticket' => $nextTicket,
            'message' => 'Ticket appelé avec succès.',
        ]);
    }

    public function startService($ticketId)
    {
        $agent = Auth::user();
        $ticket = Ticket::findOrFail($ticketId);

        if ($ticket->agent_id !== $agent->id) {
            return response()->json([
                'error' => 'Ce ticket ne vous est pas assigné.'
            ], 403);
        }

        if ($ticket->status !== 'called') {
            return response()->json([
                'error' => 'Ce ticket ne peut pas être démarré.'
            ], 422);
        }

        $ticket->update([
            'status' => 'in_progress',
            'served_at' => now(),
        ]);

        return response()->json([
            'ticket' => $ticket,
            'message' => 'Service démarré.',
        ]);
    }

    public function completeService($ticketId)
    {
        $agent = Auth::user();
        $ticket = Ticket::findOrFail($ticketId);

        if ($ticket->agent_id !== $agent->id) {
            return response()->json([
                'error' => 'Ce ticket ne vous est pas assigné.'
            ], 403);
        }

        if ($ticket->status !== 'in_progress') {
            return response()->json([
                'error' => 'Ce ticket n\'est pas en cours.'
            ], 422);
        }

        $ticket->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        return response()->json([
            'ticket' => $ticket,
            'message' => 'Service terminé avec succès.',
        ]);
    }

    public function skipTicket($ticketId)
    {
        $agent = Auth::user();
        $ticket = Ticket::findOrFail($ticketId);

        if ($ticket->agent_id !== $agent->id) {
            return response()->json([
                'error' => 'Ce ticket ne vous est pas assigné.'
            ], 403);
        }

        $ticket->update([
            'agent_id' => null,
            'status' => 'waiting',
            'called_at' => null,
            'served_at' => null,
        ]);

        return response()->json(['message' => 'Ticket reporté.']);
    }

    public function stats()
    {
        $agents = Agent::with(['todayTickets'])
            ->where('is_active', true)
            ->get()
            ->map(function ($agent) {
                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'code' => $agent->code,
                    'status' => $agent->status,
                    'today_tickets' => $agent->todayTickets()->count(),
                    'average_service_time' => $agent->average_service_time,
                    'satisfaction_rate' => $agent->satisfaction_rate,
                ];
            });

        return response()->json(['agents' => $agents]);
    }
}
