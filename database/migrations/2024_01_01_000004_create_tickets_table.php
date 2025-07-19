<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('number', 20)->unique();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->foreignId('agent_id')->nullable()->constrained()->onDelete('set null');
            $table->string('client_phone')->nullable();
            $table->enum('status', ['waiting', 'called', 'in_progress', 'completed', 'cancelled', 'no_show'])
                  ->default('waiting');
            $table->enum('priority', ['normal', 'high', 'urgent'])->default('normal');
            $table->timestamp('called_at')->nullable();
            $table->timestamp('served_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('rating')->nullable(); // 1-5
            $table->text('feedback')->nullable();
            $table->integer('estimated_wait_time')->nullable(); // en minutes
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['service_id', 'status']);
            $table->index(['agent_id', 'status']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('tickets');
    }
};
