<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@phantom.test'],
            [
                'name'              => 'Phantom Admin',
                'password'          => Hash::make('phantom123'),
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@phantomaficionado.com'],
            [
                'name'              => 'Phantom Admin',
                'password'          => Hash::make('phantom123'),
                'email_verified_at' => now(),
            ]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
