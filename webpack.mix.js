

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

mix.js('resources/kk/src/index.js', 'public/kk/js')
   .react()
   
   .setPublicPath('public');

   mix.browserSync({
    proxy: 'http://localhost:8000', // Juster til din lokale dev URL
    open: false,
    injectChanges: true,
    files: [
        'public/admin/js/**/*.js',
        'public/admin/css/**/*.css',
        'resources/views/admin/dashboard.blade.php',
        'resources/js/**/*.jsx', // Tilføj dette hvis du bruger JSX med React
        'resources/js/**/*.js',
    ]
});


