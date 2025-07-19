<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\Agent;
use App\Models\Service;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $today = Carbon::today();
        
        // Statistiques principales
        $todayTickets = Ticket::whereDate('created_at', $today)->count();
        $completedTickets = Ticket::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->count();
        
        $serviceRate = $todayTickets > 0 ? round(($completedTickets / $todayTickets) * 100, 1) : 0;
        
        $avgWaitTime = Ticket::whereDate('created_at', $today)
            ->whereNotNull('called_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (called_at - created_at))/60) as avg_wait')
            ->value('avg_wait');
        
        $avgSatisfaction = Ticket::whereDate('created_at', $today)
            ->whereNotNull('rating')
            ->avg('rating');
        
        $satisfactionRate = $avgSatisfaction ? round(($avgSatisfaction / 5) * 100, 1) : 0;
        
        // Statistiques par jour de la semaine
        $weeklyStats = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayTickets = Ticket::whereDate('created_at', $date)->count();
            $dayCompleted = Ticket::whereDate('created_at', $date)
                ->where('status', 'completed')
                ->count();
            
            $weeklyStats[] = [
                'day' => $date->format('D'),
                'date' => $date->format('Y-m-d'),
                'tickets' => $dayTickets,
                'served' => $dayCompleted,
            ];
        }
        
        // Répartition par service
        $serviceStats = Service::withCount(['todayTickets'])
            ->where('is_active', true)
            ->get()
            ->map(function ($service) use ($todayTickets) {
                $percentage = $todayTickets > 0 ? round(($service->today_tickets_count / $todayTickets) * 100) : 0;
                return [
                    'name' => $service->name,
                    'count' => $service->today_tickets_count,
                    'percentage' => $percentage,
                    'color' => $service->color,
                ];
            });

        return response()->json([
            'main_stats' => [
                'today_tickets' => $todayTickets,
                'service_rate' => $serviceRate,
                'avg_wait_time' => round($avgWaitTime ?? 0, 1),
                'satisfaction_rate' => $satisfactionRate,
            ],
            'weekly_stats' => $weeklyStats,
            'service_distribution' => $serviceStats,
            'current_queue' => [
                'waiting' => Ticket::where('status', 'waiting')->count(),
                'in_progress' => Ticket::where('status', 'in_progress')->count(),
                'active_agents' => Agent::where('status', 'active')->count(),
            ],
        ]);
    }

    public function realtimeStatus()
    {
        return response()->json([
            'system_status' => 'operational',
            'active_agents' => Agent::where('status', 'active')->count(),
            'total_agents' => Agent::where('is_active', true)->count(),
            'current_queue' => Ticket::where('status', 'waiting')->count(),
            'in_progress' => Ticket::where('status', 'in_progress')->count(),
            'last_updated' => now()->toISOString(),
        ]);
    }

    public function recentActivity()
    {
        $activities = collect();
        
        // Tickets récents
        $recentTickets = Ticket::with(['service', 'agent'])
            ->whereIn('status', ['completed', 'in_progress', 'called'])
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();
        
        foreach ($recentTickets as $ticket) {
            $activities->push([
                'time' => $ticket->updated_at->format('H:i'),
                'action' => $this->getTicketActivityMessage($ticket),
                'type' => $this->getActivityType($ticket->status),
            ]);
        }
        
        return response()->json([
            'activities' => $activities->sortByDesc('time')->values()->take(5),
        ]);
    }

    private function getTicketActivityMessage($ticket)
    {
        switch ($ticket->status) {
            case 'completed':
                return "Ticket #{$ticket->number} traité par {$ticket->agent->name}";
            case 'in_progress':
                return "Ticket #{$ticket->number} en cours - {$ticket->service->name}";
            case 'called':
                return "Ticket #{$ticket->number} appelé par {$ticket->agent->name}";
            default:
                return "Nouveau ticket #{$ticket->number} - {$ticket->service->name}";
        }
    }

    private function getActivityType($status)
    {
        switch ($status) {
            case 'completed':
                return 'success';
            case 'in_progress':
            case 'called':
                return 'info';
            default:
                return 'info';
        }
    }
}
