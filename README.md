# laravel-elixir-system

Laravel Elixir extension to transform ES6 modules to System. Inspired by [flarum-gulp](https://github.com/flarum/flarum-gulp).

ES6 System Loader Polyfills: [SystemJS](https://github.com/systemjs/systemjs), [ES6 Module Loader](https://github.com/ModuleLoader/es6-module-loader) or [ES6 Micro Loader](https://github.com/caridy/es6-micro-loader)


## Installation

```bash
npm install --save-dev laravel-elixir-system
```

## Usage

`mix.system(modules, output, baseDir, options)`

- `modules` - A map of module prefixes to their source files.
- `output` - The resulting file to write to. Defaults to `public/js/bundle.js`.
- `baseDir` - The base directory of the source files. Defaults to `resources/assets/js`.
- `options` - An object of options:
    - `includeHelpers` - Include Babel helpers. Default: `true`.

## Example

Let's say you have an app with some modules for the main component, some for the admin and some that are shared:

```
.
├── app
|   ├── App.js
|   └── ModuleA.js 
├── admin
|   ├── App.js 
|   └── ModuleB.js
└── lib
    └── ModuleC.js
```

```javascript
var elixir = require('laravel-elixir');

require('laravel-elixir-system');

elixir(function (mix) {
    // App + shared modules
    mix.system({
        'app': [
            'app/**/*.js',
        ],
        'lib': [
            'lib/**/*.js',
        ],
    }, 'public/js/app.js');
    
    // Admin + shared modules
    mix.system({
        'admin': [
            'admin/**/*.js',
        ],
        'lib': [
            'lib/**/*.js',
        ],
    }, 'public/js/admin.js');
});
```

Then using the one of the polyfills:

```javascript
var App = System.get('app/App').default;
var ModuleA = System.get('app/ModuleA').default;
var ModuleC = System.get('lib/ModuleC').default;

var app = new App();
var mA = new ModuleA();
var mC = new ModuleC();
```

See the [example](example) directory for a complete example.
