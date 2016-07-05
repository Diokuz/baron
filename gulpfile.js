var _ = require('lodash');
var gulp = require('gulp');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');

var eslint = require('gulp-eslint');

var concat = require('gulp-concat');
var removeCode = require('gulp-remove-code');
var uglify = require('gulp-uglify');

var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

function buildFiles(params) {
    var full = ['core', 'fix', 'autoUpdate', 'controls', 'pull', 'debug'];
    var fns;

    params = params || {};

    if (params.full) {
        fns = full;
    } else if (params.core) {
        fns = ['core', 'autoUpdate'];
    } else {
        fns = _.difference(full, ['pull']);
    }

    return _.map(fns, function(fn) {
        return 'src/' + fn + '.js';
    });
}

/**
 * Linters
 */
gulp.task('lint.eslint', function() {
    return gulp.src([
        'src/**/*.js',
        'demo/**/*.js',
        'test/**/*.js',
        '!demo/baron.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint.eslint']);

/**
 * Build
 */
gulp.task('build.demo', function() {
    return gulp.src(buildFiles())
    .pipe(concat('baron.js'))
    .pipe(gulp.dest('demo/'));
});

gulp.task('build.baron', function() {
    return gulp.src(buildFiles(argv))
    .pipe(concat('baron.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(removeCode({production: true}))
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
gulp.task('copy', function() {
    return gulp.src([
        'dist/baron.js',
        'dist/baron.min.js'
    ])
    .pipe(gulp.dest('./'))
});

gulp.task('build', ['build.baron', 'build.demo']);
gulp.task('default', function(cb) {
    runSequence('t', 'build', 'copy', cb);
});

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

gulp.task('unit', function() {
    return gulp.src([
        'test/**/*.spec.js'
    ], {read: false})
        .pipe(mocha());
});

gulp.task('t', function(cb) {
    runSequence('lint', 'test', 'unit', cb);
});
