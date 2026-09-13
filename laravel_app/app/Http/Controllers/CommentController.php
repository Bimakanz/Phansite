<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Return latest 20 comments (paginated)
    public function index(Request $request)
    {
        $page = max(1, (int) $request->query('page', 1));
        $perPage = 20;

        $comments = Comment::latest()
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get(['id', 'username', 'text', 'created_at']);

        $total = Comment::count();

        return response()->json([
            'comments' => $comments,
            'total' => $total,
            'page' => $page,
            'has_more' => ($page * $perPage) < $total,
        ]);
    }

    // Store a new comment
    public function store(Request $request)
    {
        $request->validate([
            'username' => 'nullable|string|max:50',
            'text' => 'required|string|max:200',
        ]);

        // Rate limit: max 5 comments per IP per hour
        $ip = $request->ip();
        $recentCount = Comment::where('ip_address', $ip)
            ->where('created_at', '>=', now()->subHour())
            ->count();

        if ($recentCount >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'TRANSMISSION LIMIT REACHED. WAIT BEFORE SENDING AGAIN.',
            ], 429);
        }

        $username = trim($request->username ?? '');
        if (empty($username)) {
            $username = 'ANONYMOUS';
        }

        // Sanitize: uppercase, max 30 visible chars
        $username = strtoupper(substr($username, 0, 30));

        $comment = Comment::create([
            'username' => $username,
            'text' => $request->text,
            'ip_address' => $ip,
        ]);

        return response()->json([
            'success' => true,
            'comment' => [
                'id' => $comment->id,
                'username' => $comment->username,
                'text' => $comment->text,
                'created_at' => $comment->created_at,
            ],
        ]);
    }
}
