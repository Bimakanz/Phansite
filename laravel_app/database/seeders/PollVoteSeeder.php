<?php

namespace Database\Seeders;

use App\Models\PollVote;
use Illuminate\Database\Seeder;

class PollVoteSeeder extends Seeder
{
    public function run(): void
    {
        if (PollVote::count() === 0) {
            for ($i = 0; $i < 48; $i++) {
                PollVote::create(['choice' => 'YES', 'created_at' => now()->subMinutes(rand(10, 1000))]);
            }
            for ($i = 0; $i < 6; $i++) {
                PollVote::create(['choice' => 'NO', 'created_at' => now()->subMinutes(rand(10, 1000))]);
            }
        }
    }
}
