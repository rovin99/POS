<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
{
    $response = $next($request);

    $origin = $request->header('Origin');
    if ($origin !== null) {
        $allowedOrigins = [
            'http://localhost:3000', // Add the origin(s) you want to allow
            // Add more origins if needed
        ];

        if (in_array($origin, $allowedOrigins)) {
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Request-With');
            $response->header('Access-Control-Allow-Credentials', 'true');
        }
    }

    return $response;
}
}
