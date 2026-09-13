<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CallingCard;
use App\Models\Certificate;
use App\Models\Experience;
use App\Models\Project;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'      => Project::count(),
                'experiences'   => Experience::count(),
                'certificates'  => Certificate::count(),
                'active'        => Project::where('status', 'active')->count(),
                'calling_cards' => CallingCard::count(),
                'unread_cards'  => CallingCard::where('status', 'unread')->count(),
            ],
            'recent_cards' => CallingCard::latest()->take(5)->get(),
        ]);
    }
}
