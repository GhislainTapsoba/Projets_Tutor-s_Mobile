<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Agency;
use App\Models\Service;
use App\Models\Agent;
use Illuminate\Support\Facades\Hash;

class DKTSolutionsSeeder extends Seeder
{
    public function run()
    {
        // Créer l'agence DKT Solutions
        $agency = Agency::create([
            'name' => 'DKT Solutions',
            'address' => 'Avenue de l\'Indépendance, Ouagadougou, Burkina Faso',
            'phone' => '+226 25 30 45 67',
            'email' => 'contact@dkt-solutions.bf',
            'opening_hours' => [
                'monday' => ['open' => '07:30', 'close' => '17:00'],
                'tuesday' => ['open' => '07:30', 'close' => '17:00'],
                'wednesday' => ['open' => '07:30', 'close' => '17:00'],
                'thursday' => ['open' => '07:30', 'close' => '17:00'],
                'friday' => ['open' => '07:30', 'close' => '17:00'],
                'saturday' => ['open' => '08:00', 'close' => '12:00'],
                'sunday' => ['open' => null, 'close' => null],
            ],
            'max_queue_size' => 50,
            'settings' => [
                'sms_notifications' => true,
                'auto_call_next' => false,
                'max_service_time' => 30,
            ],
        ]);

        // Créer les services
        $services = [
            [
                'name' => 'Consultation technique',
                'code' => 'TECH',
                'description' => 'Support technique et dépannage',
                'icon' => '🔧',
                'average_time' => 15,
                'color' => '#10B981',
            ],
            [
                'name' => 'Support administratif',
                'code' => 'ADMIN',
                'description' => 'Démarches administratives et documents',
                'icon' => '📋',
                'average_time' => 10,
                'color' => '#3B82F6',
            ],
            [
                'name' => 'Service commercial',
                'code' => 'COM',
                'description' => 'Ventes et informations commerciales',
                'icon' => '💼',
                'average_time' => 12,
                'color' => '#F59E0B',
            ],
            [
                'name' => 'Réclamations',
                'code' => 'REC',
                'description' => 'Traitement des réclamations clients',
                'icon' => '📞',
                'average_time' => 20,
                'color' => '#EF4444',
            ],
            [
                'name' => 'Informations générales',
                'code' => 'INFO',
                'description' => 'Renseignements et orientation',
                'icon' => 'ℹ️',
                'average_time' => 5,
                'color' => '#8B5CF6',
            ],
        ];

        foreach ($services as $serviceData) {
            Service::create(array_merge($serviceData, ['agency_id' => $agency->id]));
        }

        // Créer les agents
        $agents = [
            [
                'name' => 'Agent DKT-001',
                'code' => 'DKT-001',
                'email' => 'agent001@dkt-solutions.bf',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Agent DKT-002',
                'code' => 'DKT-002',
                'email' => 'agent002@dkt-solutions.bf',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Agent DKT-003',
                'code' => 'DKT-003',
                'email' => 'agent003@dkt-solutions.bf',
                'password' => Hash::make('password123'),
            ],
            [
                'name' => 'Agent DKT-004',
                'code' => 'DKT-004',
                'email' => 'agent004@dkt-solutions.bf',
                'password' => Hash::make('password123'),
            ],
        ];

        foreach ($agents as $agentData) {
            Agent::create(array_merge($agentData, ['agency_id' => $agency->id]));
        }
    }
}
