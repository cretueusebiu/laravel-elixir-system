var elixir = require('laravel-elixir');

require('laravel-elixir-system');

var basePath = 'src';

elixir(function (mix) {
    // App + shared modules
    mix.system({
        'app': [
            'app/**/*.js',
        ],
        'lib': [
            'lib/**/*.js',
        ],
    }, 'dist/app.js', basePath);

    // Admin + shared modules
    mix.system({
        'admin': [
            'admin/**/*.js',
        ],
        'lib': [
            'lib/**/*.js',
        ],
    }, 'dist/admin.js', basePath);
});
