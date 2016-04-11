var gulp = require('gulp');
var file = require('gulp-file');
var babel = require('gulp-babel');
var order = require('gulp-order');
var concat = require('gulp-concat');
var babelCore = require('babel-core');
var Elixir = require('laravel-elixir');
var streamqueue = require('streamqueue');
var config = Elixir.config;
var plugins = Elixir.Plugins;

/**
 * ES6 modules to System.
 *
 * @param {Object} modules
 * @param {String} output
 * @param {String} baseDir
 * @param {Object} options
 */
Elixir.extend('system', function (modules, output, baseDir, options) {
    if (baseDir != null && typeof baseDir == 'object') {
        options = baseDir;
        baseDir = null;
    }

    var babelOptions = Object.assign({}, {
        moduleIds: true,
        plugins: ['external-helpers', 'transform-es2015-modules-systemjs']
    }, config.js.babel.options);

    options = Object.assign({}, {
        babel: babelOptions,
        uglify: config.production,
        sourcemaps: !config.production
    }, options || {});

    var task = new Elixir.Task('system', function () {
        var stream = streamqueue({objectMode: true});

        stream.on('error', function (e) {
            new Elixir.Notification().error(e, 'ES6 to System Failed!');
            this.emit('end');
        });

        stream.pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.init()));

        if (options.includeHelpers) {
            stream.queue(
                file('helpers.js', babelCore.buildExternalHelpers(null, 'global'), {src: true})
            );
        }

        for (var prefix in modules) {
            var paths = prepGulpPaths(modules[prefix], baseDir, output);
            babelOptions = Object.assign({}, options.babel, {moduleRoot: prefix});

            this.log(paths.src, paths.output);

            stream.queue(
                gulp
                .src(paths.src.path)
                .pipe(order(Array.isArray(paths.src.path) ? paths.src.path : [paths.src.path]))
                .pipe(babel(babelOptions))
            );
        }

        return stream.done()
            .pipe(concat(paths.output.name, {newLine: '\n'}))
            .pipe(plugins.if(options.uglify, plugins.uglify()))
            .pipe(plugins.if(options.sourcemaps, plugins.sourcemaps.write()))
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Elixir.Notification('ES6 to System Compiled!'));
    });

    for (var prefix in modules) {
        var paths = prepGulpPaths(modules[prefix], baseDir, output);

        modules[prefix].forEach(function () {
            task.watch(paths.src.path);
        });
    }
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  baseDir
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var prepGulpPaths = function (src, baseDir, output) {
    return new Elixir.GulpPaths()
        .src(src, baseDir || config.get('assets.js.folder'))
        .output(output || config.get('public.js.outputFolder'), 'bundle.js');
};
