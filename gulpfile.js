var gulp = require('gulp');
var browserify = require('browserify');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream');
var guppy = require('git-guppy')(gulp);

// Babel - converts ES6 code to ES5 - however it doesn't handle imports.
// Browserify - crawls your code for dependencies and packages them up 
// into one file. can have plugins.
// Babelify - a babel plugin for browserify, to make browserify 
// handle es6 including imports.
gulp.task('bundle', function() {
	browserify({
    	entries: './assets/js/app.js',
    	debug: true
  	})
    .transform('babelify',{presets: ['env']})
    .on('error',gutil.log)
    .bundle()
    .on('error',gutil.log)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(''));
});

gulp.task('watch',function() {
	watch(['./assets','./assets/**/*.js','./assets/js/*.js'],{ignoreInitial: false}).pipe(gulp.dest('bundle'));
});
 
gulp.task('default', ['bundle','watch']);