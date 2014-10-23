var _ = require('lodash');
var gulp = require('gulp');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');

var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var mochaPhantomJS = require('gulp-mocha-phantomjs');

function buildFiles(params) {
    var full = ['core', 'fix', 'autoUpdate', 'controls', 'pull', 'test'];
    var fns;

    if (params.full) {
        fns = full;
    } else if (params.core) {
        fns = ['core', 'autoUpdate'];
    } else {
        fns = _.difference(full, ['test', 'full']);
    }

    return _.map(fns, function(fn) {
        return 'src/' + fn + '.js';
    });
}

/**
 * Linters
 */
gulp.task('lint.jshint', function() {
    return gulp.src([
        'src/**/*.js',
        'demo/**/*.js',
        'test/**/*.js'
    ])
    .pipe(jshint('config/.jshint'))
    .pipe(jshint.reporter('jshint-summary', {
        verbose: true,
        reasonCol: 'cyan,bold'
    }))
    .on('jshint.failed', function() {
        console.log('[lint.jshint] failed');
    });
});

gulp.task('lint.jscs', function() {
    return gulp.src([
        'src/**/*.js',
        'test/**/*.js'
    ])
    .pipe(jscs('config/.jscs'))
    .on('jscs.failed', function() {
        console.log('[lint.jscs] failed');
    });
});

gulp.task('lint', ['lint.jshint', 'lint.jscs']);

/**
 * Build
 */
gulp.task('build.demo', function() {
    return gulp.src(buildFiles({full: true}))
    .pipe(concat('baron.js'))
    .pipe(gulp.dest('demo/'));
});

gulp.task('build.baron', function() {
    return gulp.src(buildFiles(argv))
    .pipe(concat('baron.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(uglify({
        compress: {
            global_defs: {
                DEBUG: false
            },
            unsafe: true
        }
    }))
    .pipe(concat('baron.min.js'))
    .pipe(gulp.dest('dist/'));
});

// Копируем в корень собранные файлы, чтоб в репе были готовые версии
gulp.task('copy', ['build.baron'], function() {
    return gulp.src([
        'dist/baron.js',
        'dist/baron.min.js'
    ])
    .pipe(gulp.dest('./'))
});

gulp.task('build', ['build.baron', 'build.demo', 'copy']);

/**
 * Tests
 */
gulp.task('test', function() {
    return gulp.src(['test/*.auto.html'])
    .pipe(mochaPhantomJS({
        phantomjs: {
            viewportSize: {
                width: 1024,
                height: 768
            }
        }
    }));
});

gulp.task('t', function(cb) {
    runSequence('lint', 'build', 'test');
});
