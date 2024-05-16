<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $referrer = $request->headers->get('referer');
        $allowedReferrer = env('APP_URL') . '/Admin';
        
        if ($referrer !== $allowedReferrer) {
            abort(403, 'Unauthorized action.');
        }
        
        return $next($request);
    }
}