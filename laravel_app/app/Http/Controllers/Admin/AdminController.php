<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Experience;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'projects'    => Project::count(),
                'experiences' => Experience::count(),
                'active'      => Project::where('status', 'active')->count(),
            ],
        ]);
    }
}
