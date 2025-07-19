<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'icon',
        'average_time',
        'is_active',
        'color',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'average_time' => 'integer',
    ];

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function waitingTickets()
    {
        return $this->hasMany(Ticket::class)->where('status', 'waiting');
    }

    public function todayTickets()
    {
        return $this->hasMany(Ticket::class)
            ->whereDate('created_at', today());
    }

    public function getEstimatedWaitTimeAttribute()
    {
        $waitingCount = $this->waitingTickets()->count();
        return $waitingCount * $this->average_time;
    }
}
