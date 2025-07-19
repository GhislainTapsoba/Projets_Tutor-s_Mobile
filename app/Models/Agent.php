<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Agent extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'name',
        'code',
        'email',
        'password',
        'status',
        'is_active',
        'last_activity',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_activity' => 'datetime',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function currentTicket()
    {
        return $this->hasOne(Ticket::class)->where('status', 'in_progress');
    }

    public function todayTickets()
    {
        return $this->hasMany(Ticket::class)
            ->whereDate('created_at', today());
    }

    public function getAverageServiceTimeAttribute()
    {
        return $this->tickets()
            ->whereNotNull('served_at')
            ->whereNotNull('called_at')
            ->selectRaw('AVG(EXTRACT(EPOCH FROM (served_at - called_at))) as avg_time')
            ->value('avg_time');
    }

    public function getSatisfactionRateAttribute()
    {
        $total = $this->tickets()->whereNotNull('rating')->count();
        if ($total === 0) return 0;
        
        $sum = $this->tickets()->whereNotNull('rating')->sum('rating');
        return round(($sum / ($total * 5)) * 100, 1);
    }
}
