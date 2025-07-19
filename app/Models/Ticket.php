<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'number',
        'service_id',
        'agent_id',
        'client_phone',
        'status',
        'priority',
        'called_at',
        'served_at',
        'completed_at',
        'rating',
        'feedback',
        'estimated_wait_time',
    ];

    protected $casts = [
        'called_at' => 'datetime',
        'served_at' => 'datetime',
        'completed_at' => 'datetime',
        'rating' => 'integer',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function getQueuePositionAttribute()
    {
        return Ticket::where('service_id', $this->service_id)
            ->where('status', 'waiting')
            ->where('created_at', '<', $this->created_at)
            ->count() + 1;
    }

    public function getServiceTimeAttribute()
    {
        if (!$this->called_at || !$this->served_at) {
            return null;
        }
        
        return $this->called_at->diffInSeconds($this->served_at);
    }

    public function getWaitTimeAttribute()
    {
        if (!$this->called_at) {
            return $this->created_at->diffInSeconds(now());
        }
        
        return $this->created_at->diffInSeconds($this->called_at);
    }

    public static function generateTicketNumber()
    {
        $today = now()->format('Ymd');
        $lastTicket = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();
        
        $sequence = $lastTicket ? (int)substr($lastTicket->number, -3) + 1 : 1;
        
        return $today . str_pad($sequence, 3, '0', STR_PAD_LEFT);
    }
}
