<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Services\ImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateController extends Controller
{
    // Admin views
    public function adminIndex()
    {
        $certificates = Certificate::latest()->get();
        return Inertia::render('Admin/Certificates/Index', compact('certificates'));
    }

    public function create()
    {
        return Inertia::render('Admin/Certificates/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'year'           => 'nullable|string|max:50',
            'arcana'         => 'nullable|string|max:50',
            'credential_url' => 'nullable|url',
            'description'    => 'nullable|string',
            'image_url'      => 'nullable|url',
            'image_file'     => 'nullable|image|max:4096',
            'order'          => 'nullable|integer',
        ]);

        $imagePath = null;
        if ($request->hasFile('image_file')) {
            $imagePath = ImageOptimizer::storeAsWebp($request->file('image_file'), 'certificates');
        }

        Certificate::create(array_merge($validated, [
            'image_path' => $imagePath,
            'arcana'     => $validated['arcana'] ?? 'STAR',
            'order'      => $validated['order'] ?? 0,
        ]));

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate recorded into the Metaverse Archive!');
    }

    public function edit(Certificate $certificate)
    {
        return Inertia::render('Admin/Certificates/Edit', compact('certificate'));
    }

    public function update(Request $request, Certificate $certificate)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'year'           => 'nullable|string|max:50',
            'arcana'         => 'nullable|string|max:50',
            'credential_url' => 'nullable|url',
            'description'    => 'nullable|string',
            'image_url'      => 'nullable|url',
            'image_file'     => 'nullable|image|max:4096',
            'order'          => 'nullable|integer',
        ]);

        if ($request->hasFile('image_file')) {
            if ($certificate->image_path) {
                Storage::disk('public')->delete($certificate->image_path);
            }
            $validated['image_path'] = ImageOptimizer::storeAsWebp($request->file('image_file'), 'certificates');
        }

        $certificate->update($validated);

        return redirect()->route('admin.certificates.index')->with('success', 'Certificate successfully updated!');
    }

    public function destroy(Certificate $certificate)
    {
        if ($certificate->image_path) {
            Storage::disk('public')->delete($certificate->image_path);
        }
        $certificate->delete();
        return redirect()->route('admin.certificates.index')->with('success', 'Certificate purged from archive!');
    }
}
