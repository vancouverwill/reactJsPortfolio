var gulp       = require('gulp');  
var babel = require('gulp-babel'); 
var less       = require('gulp-less');
var watch      = require('gulp-watch');
var cssnano = require('gulp-cssnano'); 
var sourcemaps = require('gulp-sourcemaps');
var rename     = require('gulp-rename');  
var header     = require('gulp-header');  
var pkg        = require('./package.json');
var autoprefixer = require('gulp-autoprefixer');


var watchify = require('watchify');
var babelify    = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');


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
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('./css/'));
});

gulp.task('babel', function() {
	return gulp.src('src/portfolio.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['react']
		}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest('build'));
});


/* Task to watch less changes */
gulp.task('watch-less', function() {  
  gulp.watch('./css/*.less' , ['compile-less']);
  gulp.watch('./css/styles.css' , ['autoprefixer']);
  // gulp.watch('./src/*.js' , ['babel']);
});


gulp.task('autoprefixer', function () {
    return gulp.src('css/styles.css')
        // .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/'));
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


// add custom browserify options here
var customOpts = {
  entries: ['./build/portfolio.js'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var bundler = watchify(browserify(opts)); 

// add transformations here
// i.e. b.transform(coffeeify);
// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'build'
}));

gulp.task('watchify-react', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler
bundler.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return bundler.bundle()
    // log errors if they happen
    .on('error', function (err) {
    	gutil.log.bind(gutil, 'Browserify Error')
    	this.emit("end");
    })
    .pipe(source('./dist/bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./'));
}





/* Task when running `gulp` from terminal */
// gulp.task('default', ['compile-less', 'watch-less', 'watchify-react']);  
gulp.task('default', ['compile-less', 'watch-less']);  