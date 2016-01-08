var gulp       = require('gulp');  
var less       = require('gulp-less');
var watch      = require('gulp-watch');
var cssnano = require('gulp-cssnano'); 
var sourcemaps = require('gulp-sourcemaps');
var rename     = require('gulp-rename');  
var header     = require('gulp-header');  
var pkg        = require('./package.json');

/* Prepare banner text */
var banner = ['/**',  
  ' * <%= pkg.name %> v<%= pkg.version %>',
  ' * <%= pkg.description %>',
  ' * <%= pkg.author.name %>',
  ' */',
  ''].join('\n');

/* Task to compile less */
gulp.task('compile-less', function() {  
  gulp.src('./css/styles.less')
    .pipe(less())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./css/'));
});


/* Task to watch less changes */
gulp.task('watch-less', function() {  
  gulp.watch('./css/*.less' , ['compile-less']);
});


/* Task to minify css */
gulp.task('minify-css', function() {  
  gulp.src('./css/styles.css')
  	.pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('styles.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest( './css/dist/' ));
});


/* Task when running `gulp` from terminal */
gulp.task('default', ['compile-less', 'watch-less']);  