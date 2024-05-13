

const mix = require('laravel-mix');

mix.js('resources/js/src/index.js', 'public/client/js')
   .react()
   
   .setPublicPath('public')
   .sourceMaps();

   mix.browserSync({
    proxy: 'http://localhost:8000', // Juster til din lokale dev URL
    open: false,
    injectChanges: true,
    files: [
        'public/js/**/*.js',
        
        'resources/views/**/*.blade.php',
        'resources/js/**/*.jsx', // Tilføj dette hvis du bruger JSX med React
    
    ]
});

