<?php

namespace App\Http\Controllers;

use App\Models\PollVote;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // 3 Latest Projects for the home showcase
        $latestProjects = Project::latest()->take(3)->get();

        // Real-time Poll Statistics
        $yesCount = PollVote::where('choice', 'YES')->count();
        $noCount = PollVote::where('choice', 'NO')->count();
        $totalVotes = $yesCount + $noCount;
        $pollPercent = $totalVotes > 0 ? round(($yesCount / $totalVotes) * 100, 1) : 88.9;

        // Check if user already voted from this IP
        $userVote = PollVote::where('ip_address', $request->ip())->latest()->value('choice');

        return Inertia::render('Home', [
            'latestProjects' => $latestProjects,
            'pollData' => [
                'yes' => $yesCount,
                'no' => $noCount,
                'total' => $totalVotes,
                'percent' => $pollPercent,
                'userVote' => $userVote,
            ],
        ]);
    }

    public function vote(Request $request)
    {
        $request->validate([
            'choice' => 'required|in:YES,NO',
        ]);

        $ip = $request->ip();

        // Record vote
        PollVote::create([
            'choice' => $request->choice,
            'ip_address' => $ip,
            'user_agent' => $request->userAgent(),
        ]);

        $yesCount = PollVote::where('choice', 'YES')->count();
        $noCount = PollVote::where('choice', 'NO')->count();
        $totalVotes = $yesCount + $noCount;
        $pollPercent = $totalVotes > 0 ? round(($yesCount / $totalVotes) * 100, 1) : 88.9;

        return response()->json([
            'success' => true,
            'choice' => $request->choice,
            'yes' => $yesCount,
            'no' => $noCount,
            'total' => $totalVotes,
            'percent' => $pollPercent,
            'message' => $request->choice === 'YES'
                ? 'YOUR ADMIRATION HAS BEEN TRANSMITTED TO THE PHANTOM THIEVES!'
                : 'YOUR CRITIQUE HAS BEEN RECORDED IN THE METAVERSE!',
        ]);
    }
}
