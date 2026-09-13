<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    // Public view
    public function index()
    {
        $experiences = Experience::ordered()->get();
        return Inertia::render('Experience', compact('experiences'));
    }

    // Admin views
    public function adminIndex()
    {
        $experiences = Experience::ordered()->get();
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
            'type'           => 'required|in:certificate,work,education',
            'description'    => 'nullable|string',
            'date_start'     => 'nullable|date',
            'date_end'       => 'nullable|date',
            'image_url'      => 'nullable|url',
            'image_file'     => 'nullable|image|max:4096',
            'credential_url' => 'nullable|url',
            'order'          => 'integer',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('experiences', 'public');
        }

        Experience::create(array_merge($validated, ['image_path' => $imagePath]));

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
            'type'           => 'required|in:certificate,work,education',
            'description'    => 'nullable|string',
            'date_start'     => 'nullable|date',
            'date_end'       => 'nullable|date',
            'image_url'      => 'nullable|url',
            'image_file'     => 'nullable|image|max:4096',
            'credential_url' => 'nullable|url',
            'order'          => 'integer',
        ]);

        if ($request->hasFile('image_file')) {
            if ($experience->image_path) {
                Storage::disk('public')->delete($experience->image_path);
            }
            $validated['image_path'] = $request->file('image_file')->store('experiences', 'public');
        }

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
