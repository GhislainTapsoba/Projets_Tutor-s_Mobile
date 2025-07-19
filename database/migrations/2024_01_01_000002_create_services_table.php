<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('code', 10)->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->integer('average_time')->default(5); // en minutes
            $table->boolean('is_active')->default(true);
            $table->string('color', 7)->default('#10B981');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
};
