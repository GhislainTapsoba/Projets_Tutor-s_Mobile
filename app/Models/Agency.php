<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agency extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'opening_hours',
        'max_queue_size',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'opening_hours' => 'array',
        'settings' => 'array',
    ];

    public function agents()
    {
        return $this->hasMany(Agent::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}
