<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />

       
    </head>
    <body class="font-sans antialiased dark:text-white/50">
        <div id="root"></div>
        
        <script>
    
            window.App = {
                url: "{{ env('APP_URL') }}"
            };
            
        </script>
        <script src="{{ mix('client/js/index.js') }}"></script>
        <script src="https://cdn.jsdelivr.net/npm/pace-js@1.2.4/pace.min.js"></script>
    </body>
</html>