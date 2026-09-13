<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('organization');
            $table->enum('type', ['certificate', 'work', 'education'])->default('certificate');
            $table->text('description')->nullable();
            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();
            $table->string('image_url')->nullable();
            $table->string('image_path')->nullable();
            $table->string('credential_url')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiences');
    }
};
