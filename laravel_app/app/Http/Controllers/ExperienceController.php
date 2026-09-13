<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    // Public view
    public function index()
    {
        $experiences = Experience::latest()->get();
        $certificates = \App\Models\Certificate::latest()->get();
        return Inertia::render('Experience', compact('experiences', 'certificates'));
    }

    // Admin views
    public function adminIndex()
    {
        $experiences = Experience::latest()->get();
        return Inertia::render('Admin/Experiences/Index', compact('experiences'));
    }

    public function create()
    {
        return Inertia::render('Admin/Experiences/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'organization'   => 'required|string|max:255',
            'type'           => 'required|in:work,education',
            'description'    => 'nullable|string',
            'date_start'     => 'nullable|date',
            'date_end'       => 'nullable|date',
            'credential_url' => 'nullable|url',
            'order'          => 'nullable|integer',
        ]);

        Experience::create($validated);

        return redirect()->route('admin.experiences.index')->with('success', 'Experience created!');
    }

    public function edit(Experience $experience)
    {
        return Inertia::render('Admin/Experiences/Edit', compact('experience'));
    }

    public function update(Request $request, Experience $experience)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'organization'   => 'required|string|max:255',
            'type'           => 'required|in:work,education',
            'description'    => 'nullable|string',
            'date_start'     => 'nullable|date',
            'date_end'       => 'nullable|date',
            'credential_url' => 'nullable|url',
            'order'          => 'nullable|integer',
        ]);

        $experience->update($validated);

        return redirect()->route('admin.experiences.index')->with('success', 'Experience updated!');
    }

    public function destroy(Experience $experience)
    {
        if ($experience->image_path) {
            Storage::disk('public')->delete($experience->image_path);
        }
        $experience->delete();
        return redirect()->route('admin.experiences.index')->with('success', 'Experience deleted!');
    }
}
