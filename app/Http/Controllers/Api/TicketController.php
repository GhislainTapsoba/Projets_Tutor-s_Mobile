<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Service;
use App\Http\Requests\CreateTicketRequest;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['service', 'agent']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->has('agent_id')) {
            $query->where('agent_id', $request->agent_id);
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json($tickets);
    }

    public function store(CreateTicketRequest $request)
    {
        $service = Service::findOrFail($request->service_id);
        
        // Vérifier la capacité de la file
        $waitingCount = Ticket::where('service_id', $service->id)
            ->where('status', 'waiting')
            ->count();

        if ($waitingCount >= 50) { // Limite configurable
            return response()->json([
                'error' => 'La file d\'attente est pleine. Veuillez réessayer plus tard.'
            ], 422);
        }

        $ticket = Ticket::create([
            'number' => Ticket::generateTicketNumber(),
            'agency_id' => 1, // DKT Solutions
            'service_id' => $request->service_id,
            'client_phone' => $request->client_phone,
            'estimated_wait_time' => $service->estimated_wait_time,
        ]);

        $ticket->load(['service']);

        return response()->json([
            'ticket' => $ticket,
            'queue_position' => $ticket->queue_position,
            'estimated_wait' => $ticket->estimated_wait_time,
        ], 201);
    }

    public function show($id)
    {
        $ticket = Ticket::with(['service', 'agent'])->findOrFail($id);
        
        return response()->json([
            'ticket' => $ticket,
            'queue_position' => $ticket->status === 'waiting' ? $ticket->queue_position : null,
        ]);
    }

    public function cancel($id)
    {
        $ticket = Ticket::findOrFail($id);
        
        if (!in_array($ticket->status, ['waiting', 'called'])) {
            return response()->json([
                'error' => 'Ce ticket ne peut pas être annulé.'
            ], 422);
        }

        $ticket->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Ticket annulé avec succès.']);
    }

    public function rate(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string|max:500',
        ]);

        $ticket = Ticket::findOrFail($id);
        
        if ($ticket->status !== 'completed') {
            return response()->json([
                'error' => 'Ce ticket n\'est pas encore terminé.'
            ], 422);
        }

        $ticket->update([
            'rating' => $request->rating,
            'feedback' => $request->feedback,
        ]);

        return response()->json(['message' => 'Évaluation enregistrée avec succès.']);
    }

    public function queue(Request $request)
    {
        $serviceId = $request->get('service_id');
        
        $query = Ticket::with(['service'])
            ->where('status', 'waiting')
            ->orderBy('created_at');

        if ($serviceId) {
            $query->where('service_id', $serviceId);
        }

        $tickets = $query->get();

        return response()->json([
            'queue' => $tickets,
            'total_waiting' => $tickets->count(),
        ]);
    }
}
