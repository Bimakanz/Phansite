<?php

namespace App\Http\Controllers;

use App\Models\CallingCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;

class CallingCardController extends Controller
{
    /**
     * Store a newly created calling card with strict anti-spam & IP rate-limiting.
     */
    public function store(Request $request)
    {
        $clientIp = $request->ip();

        // 1. Anti-Bot Honeypot Trap
        if ($request->filled('p5_metaverse_trap')) {
            Log::warning("Bot detected via honeypot trap from IP: {$clientIp}");
            // Return fake success so bot does not retry
            return response()->json([
                'success'   => true,
                'message'   => 'Calling Card dispatched to Discord & Admin Terminal!',
                'remaining' => 0,
            ]);
        }

        // 2. Submission Timing Trap (Bots submit in under 1.5 seconds)
        if ($request->filled('_render_time')) {
            $renderTime = (int) $request->input('_render_time');
            if (time() - $renderTime < 2) {
                Log::warning("Bot detected via rapid submission (< 2s) from IP: {$clientIp}");
                return response()->json([
                    'success' => false,
                    'error'   => 'RAPID_SUBMIT',
                    'message' => 'SECURITY NOTICE // You are submitting too quickly. Please take a moment to write your decree.',
                ], 422);
            }
        }

        // 3. Short Cooldown Protection (1 dispatch every 15 seconds per IP)
        $burstKey = 'calling-card-burst:' . $clientIp;
        if (RateLimiter::tooManyAttempts($burstKey, 1)) {
            $seconds = RateLimiter::availableIn($burstKey);
            return response()->json([
                'success' => false,
                'error'   => 'COOLDOWN',
                'message' => "COGNITIVE COOLDOWN // Please wait {$seconds}s before dispatching another card.",
            ], 429);
        }

        // 4. Daily Limit Protection: Maximum 3 Calling Cards per 24 hours per IP
        $usedIn24Hours = CallingCard::where('ip_address', $clientIp)
            ->where('created_at', '>=', now()->subHours(24))
            ->count();

        if ($usedIn24Hours >= 3) {
            return response()->json([
                'success'   => false,
                'error'     => 'DAILY_LIMIT_EXCEEDED',
                'message'   => '★ SECURITY NOTICE // Daily limit reached (3/3 cards). You can only dispatch 3 Calling Cards per day from this IP to prevent Metaverse distortion.',
                'remaining' => 0,
            ], 429);
        }

        // Validate payload
        $validated = $request->validate([
            'name'    => 'required|string|min:2|max:255',
            'email'   => 'required|email|max:255',
            'message' => 'required|string|min:5|max:5000',
        ]);

        // Record cooldown hit (15 seconds)
        RateLimiter::hit($burstKey, 15);

        // Store Calling Card
        $callingCard = CallingCard::create([
            'name'       => $validated['name'],
            'email'      => $validated['email'],
            'message'    => $validated['message'],
            'status'     => 'unread',
            'ip_address' => $clientIp,
            'user_agent' => $request->userAgent(),
        ]);

        $remainingDispatches = max(0, 2 - $usedIn24Hours);

        // Send to Discord Webhook
        $webhookUrl = env('DISCORD_WEBHOOK_URL', 'https://ptb.discord.com/api/webhooks/1548594955159736400/Q-DSMtcFuk1rr6Jv8t8FgVTboqaiDSLNNbmeKquVj7dYjhM-sR4ShqzcXbs9fI9g8kdf');

        if ($webhookUrl) {
            try {
                Http::timeout(6)->post($webhookUrl, [
                    'username'   => 'Phantom Aficionado Dispatch',
                    'avatar_url' => 'https://raw.githubusercontent.com/Bimakanz/Phansite/main/assets/img/p5_tophat.png',
                    'content'    => "🚨 **A NEW CALLING CARD HAS BEEN DISPATCHED!** @here",
                    'embeds'     => [
                        [
                            'title'       => '★ [CALLING CARD] INCOMING TRANSMISSION / HR INQUIRY',
                            'description' => "A decree / message has been transmitted via the Phansite Contact Terminal for **Bimakanz**!",
                            'color'       => 15073298, // 0xE60012 Persona 5 Red
                            'fields'      => [
                                [
                                    'name'   => '👤 SENDER / HR / ALIAS',
                                    'value'  => "**" . $callingCard->name . "**",
                                    'inline' => true,
                                ],
                                [
                                    'name'   => '📧 FREQUENCY (EMAIL)',
                                    'value'  => "`" . $callingCard->email . "`",
                                    'inline' => true,
                                ],
                                [
                                    'name'   => '📜 THE DECREE (MESSAGE)',
                                    'value'  => "```\n" . mb_substr($callingCard->message, 0, 1000) . "\n```",
                                    'inline' => false,
                                ],
                                [
                                    'name'   => '🌐 METAVERSE METRICS',
                                    'value'  => "IP: `" . ($callingCard->ip_address ?? 'unknown') . "` | Quota Left: {$remainingDispatches}/3 | Received: " . now()->format('d M Y, H:i:s T'),
                                    'inline' => false,
                                ],
                            ],
                            'footer'      => [
                                'text' => 'PHANTOM AFICIONADO • COGNITIVE CMS TERMINAL',
                            ],
                            'timestamp'   => now()->toIso8601String(),
                        ],
                    ],
                ]);
            } catch (\Exception $e) {
                Log::error('Failed to send Calling Card to Discord webhook: ' . $e->getMessage());
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success'   => true,
                'message'   => 'Calling Card dispatched to Discord & Admin Terminal!',
                'card'      => $callingCard,
                'remaining' => $remainingDispatches,
            ]);
        }

        return redirect()->back()->with('success', "Calling card dispatched! ({$remainingDispatches}/3 remaining today)");
    }

    /**
     * Admin index: View all received Calling Cards / HR messages.
     */
    public function adminIndex(Request $request)
    {
        $cards = CallingCard::latest()->paginate(15);
        $unreadCount = CallingCard::where('status', 'unread')->count();

        return Inertia::render('Admin/CallingCards/Index', [
            'cards'       => $cards,
            'unreadCount' => $unreadCount,
        ]);
    }

    /**
     * Mark calling card as read.
     */
    public function markAsRead(CallingCard $callingCard)
    {
        $callingCard->update(['status' => 'read']);

        return redirect()->back()->with('success', 'Calling card marked as read.');
    }

    /**
     * Delete calling card.
     */
    public function destroy(CallingCard $callingCard)
    {
        $callingCard->delete();

        return redirect()->back()->with('success', 'Calling card removed.');
    }
}
