<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Public view
    public function index()
    {
        $projects = Project::active()->get();
        return Inertia::render('Projects', compact('projects'));
    }

    // Admin views
    public function adminIndex()
    {
        $projects = Project::orderBy('order')->get();
        return Inertia::render('Admin/Projects/Index', compact('projects'));
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack'  => 'nullable|array',
            'image_url'   => 'nullable|url',
            'image_file'  => 'nullable|image|max:4096',
            'repo_url'    => 'nullable|url',
            'live_url'    => 'nullable|url',
            'status'      => 'in:active,archived',
            'order'       => 'integer',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = $request->file('image_file')->store('projects', 'public');
        }

        Project::create(array_merge($validated, ['image_path' => $imagePath]));

        return redirect()->route('admin.projects.index')->with('success', 'Project created!');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Edit', compact('project'));
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'tech_stack'  => 'nullable|array',
            'image_url'   => 'nullable|url',
            'image_file'  => 'nullable|image|max:4096',
            'repo_url'    => 'nullable|url',
            'live_url'    => 'nullable|url',
            'status'      => 'in:active,archived',
            'order'       => 'integer',
        ]);

        if ($request->hasFile('image_file')) {
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $validated['image_path'] = $request->file('image_file')->store('projects', 'public');
        }

        $project->update($validated);

        return redirect()->route('admin.projects.index')->with('success', 'Project updated!');
    }

    public function destroy(Project $project)
    {
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }
        $project->delete();
        return redirect()->route('admin.projects.index')->with('success', 'Project deleted!');
    }
}
