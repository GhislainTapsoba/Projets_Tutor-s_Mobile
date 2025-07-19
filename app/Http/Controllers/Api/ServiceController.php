<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)
            ->withCount(['waitingTickets'])
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'code' => $service->code,
                    'description' => $service->description,
                    'icon' => $service->icon,
                    'average_time' => $service->average_time,
                    'color' => $service->color,
                    'waiting_count' => $service->waiting_tickets_count,
                    'estimated_wait_time' => $service->estimated_wait_time,
                ];
            });

        return response()->json(['services' => $services]);
    }

    public function show($id)
    {
        $service = Service::with(['waitingTickets'])
            ->findOrFail($id);

        return response()->json([
            'service' => $service,
            'stats' => [
                'waiting_count' => $service->waitingTickets->count(),
                'today_count' => $service->todayTickets()->count(),
                'estimated_wait_time' => $service->estimated_wait_time,
            ],
        ]);
    }
}
