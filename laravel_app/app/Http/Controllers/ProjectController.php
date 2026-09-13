<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProjectController extends Controller
{
    // Public view
    public function index()
    {
        $projects = Project::latest()->get();
        return Inertia::render('Projects', compact('projects'));
    }

    // Admin views
    public function adminIndex()
    {
        $projects = Project::latest()->get();
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
            'image_url'   => 'nullable|string|max:500',
            'image_file'  => 'nullable|image|max:4096',
            'repo_url'    => 'nullable|string|max:500',
            'live_url'    => 'nullable|string|max:500',
            'status'      => 'in:active,archived',
            'order'       => 'nullable|integer',
        ]);

        if (!empty($validated['repo_url']) && !str_starts_with($validated['repo_url'], 'http://') && !str_starts_with($validated['repo_url'], 'https://')) {
            $validated['repo_url'] = 'https://' . $validated['repo_url'];
        }
        if (!empty($validated['live_url']) && !str_starts_with($validated['live_url'], 'http://') && !str_starts_with($validated['live_url'], 'https://')) {
            $validated['live_url'] = 'https://' . $validated['live_url'];
        }

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = ImageOptimizer::storeAsWebp($request->file('image_file'), 'projects');
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
            'image_url'   => 'nullable|string|max:500',
            'image_file'  => 'nullable|image|max:4096',
            'repo_url'    => 'nullable|string|max:500',
            'live_url'    => 'nullable|string|max:500',
            'status'      => 'in:active,archived',
            'order'       => 'nullable|integer',
        ]);

        if (!empty($validated['repo_url']) && !str_starts_with($validated['repo_url'], 'http://') && !str_starts_with($validated['repo_url'], 'https://')) {
            $validated['repo_url'] = 'https://' . $validated['repo_url'];
        }
        if (!empty($validated['live_url']) && !str_starts_with($validated['live_url'], 'http://') && !str_starts_with($validated['live_url'], 'https://')) {
            $validated['live_url'] = 'https://' . $validated['live_url'];
        }

        if ($request->hasFile('image_file')) {
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $validated['image_path'] = ImageOptimizer::storeAsWebp($request->file('image_file'), 'projects');
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
