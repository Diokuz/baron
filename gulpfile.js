var _ = require('lodash');
var gulp = require('gulp');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');

var eslint = require('gulp-eslint');

var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs');

/**
 * Linters
 */
gulp.task('lint.eslint', function() {
    return gulp.src([
        'src/**/*.js',
        'demo/**/*.js',
        'test/**/*.js',
        '!test/webpack/*.js',
        '!demo/baron.js'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint.eslint']);

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
