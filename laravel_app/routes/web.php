<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Portfolio Routes ────────────────────────────────────────────────
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
Route::get('/experience', [ExperienceController::class, 'index'])->name('experience');
Route::get('/about', function () { return Inertia::render('About'); })->name('about');
Route::get('/contact', function () { return Inertia::render('Contact'); })->name('contact');

// ─── Admin Routes (Auth Protected) ─────────────────────────────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Projects CRUD
    Route::get('/projects', [ProjectController::class, 'adminIndex'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Experiences CRUD
    Route::get('/experiences', [ExperienceController::class, 'adminIndex'])->name('experiences.index');
    Route::get('/experiences/create', [ExperienceController::class, 'create'])->name('experiences.create');
    Route::post('/experiences', [ExperienceController::class, 'store'])->name('experiences.store');
    Route::get('/experiences/{experience}/edit', [ExperienceController::class, 'edit'])->name('experiences.edit');
    Route::put('/experiences/{experience}', [ExperienceController::class, 'update'])->name('experiences.update');
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
