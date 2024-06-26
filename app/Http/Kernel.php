<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        
        \App\Http\Middleware\Cors::class,//cors added here 
    ];
    protected $middlewareGroups = [
        'web' => [
            // Web middleware...
            
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
        ],

        'api' => [
            // API middleware...
            \Illuminate\Session\Middleware\StartSession::class,
        ],
    ];
    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        // Other middleware...
        'auth' => \App\Http\Middleware\AuthMiddleware::class,
    ];
}
