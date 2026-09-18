<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CallingCardController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ─── Public Portfolio Routes ────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/poll/vote', [HomeController::class, 'vote'])->name('poll.vote');
Route::get('/comments', [CommentController::class, 'index'])->name('comments.index');
Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/projects', [ProjectController::class, 'index'])->name('projects');
Route::get('/experience', [ExperienceController::class, 'index'])->name('experience');
Route::get('/contact', function (\Illuminate\Http\Request $request) {
    $ip = $request->ip();
    $usedToday = \App\Models\CallingCard::where('ip_address', $ip)
        ->where('created_at', '>=', now()->subHours(24))
        ->count();
    $remaining = max(0, 3 - $usedToday);

    return Inertia::render('Contact', [
        'remainingQuota' => $remaining,
    ]);
})->name('contact');
Route::post('/contact', [CallingCardController::class, 'store'])->name('contact.send');

Route::get('/debug-error', function (\Illuminate\Http\Request $request) {
    try {
        $controller = new \App\Http\Controllers\HomeController();
        return $controller->index($request);
    } catch (\Throwable $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ], 200);
    }
});

// ─── Dynamic SEO Sitemap ──────────────────────────────────────────────────
Route::get('/sitemap.xml', function () {
    if (ob_get_length()) {
        ob_clean();
    }
    $baseUrl = rtrim(url('/'), '/');
    $pages = [
        ['loc' => $baseUrl, 'priority' => '1.0', 'changefreq' => 'weekly'],
        ['loc' => $baseUrl . '/projects', 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => $baseUrl . '/experience', 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => $baseUrl . '/about', 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => $baseUrl . '/contact', 'priority' => '0.7', 'changefreq' => 'monthly'],
    ];

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($pages as $p) {
        $xml .= "  <url>\n";
        $xml .= "    <loc>" . htmlspecialchars($p['loc']) . "</loc>\n";
        $xml .= "    <lastmod>" . date('Y-m-d') . "</lastmod>\n";
        $xml .= "    <changefreq>" . $p['changefreq'] . "</changefreq>\n";
        $xml .= "    <priority>" . $p['priority'] . "</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
});

// ─── Admin Routes (Auth Protected) ─────────────────────────────────────────
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Projects CRUD
    Route::get('/projects', [ProjectController::class, 'adminIndex'])->name('projects.index');
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('/projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::match(['put', 'post'], '/projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Experiences CRUD
    Route::get('/experiences', [ExperienceController::class, 'adminIndex'])->name('experiences.index');
    Route::get('/experiences/create', [ExperienceController::class, 'create'])->name('experiences.create');
    Route::post('/experiences', [ExperienceController::class, 'store'])->name('experiences.store');
    Route::get('/experiences/{experience}/edit', [ExperienceController::class, 'edit'])->name('experiences.edit');
    Route::match(['put', 'post'], '/experiences/{experience}', [ExperienceController::class, 'update'])->name('experiences.update');
    Route::delete('/experiences/{experience}', [ExperienceController::class, 'destroy'])->name('experiences.destroy');

    // Certificates CRUD
    Route::get('/certificates', [CertificateController::class, 'adminIndex'])->name('certificates.index');
    Route::get('/certificates/create', [CertificateController::class, 'create'])->name('certificates.create');
    Route::post('/certificates', [CertificateController::class, 'store'])->name('certificates.store');
    Route::get('/certificates/{certificate}/edit', [CertificateController::class, 'edit'])->name('certificates.edit');
    Route::match(['put', 'post'], '/certificates/{certificate}', [CertificateController::class, 'update'])->name('certificates.update');
    Route::delete('/certificates/{certificate}', [CertificateController::class, 'destroy'])->name('certificates.destroy');

    // Calling Cards (HR Inquiries)
    Route::get('/calling-cards', [CallingCardController::class, 'adminIndex'])->name('calling-cards.index');
    Route::patch('/calling-cards/{callingCard}/read', [CallingCardController::class, 'markAsRead'])->name('calling-cards.read');
    Route::delete('/calling-cards/{callingCard}', [CallingCardController::class, 'destroy'])->name('calling-cards.destroy');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
