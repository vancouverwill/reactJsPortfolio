/** GULP libraries */
const gulp       = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cond = require('gulp-cond');
const eslint = require('gulp-eslint');
const gulpIf = require('gulp-if');
const less       = require('gulp-less');
const livereload = require('gulp-livereload');
const minifyCSS = require('gulp-clean-css');
const nodemon = require('gulp-nodemon');
const sourcemaps = require('gulp-sourcemaps');
const minifyJS = require('gulp-uglify');
const gutil     = require('gulp-util');  

/** other libraries */
const browserify = require('browserify');
const del = require('del');
const hmr = require('browserify-hmr');
const buffer = require('vinyl-buffer');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const watchify = require('watchify');
const {argv} = require('yargs');

// If gulp was called in the terminal with the --prod flag, set the node environment to production
if (argv.prod) {
  console.log('Running production')
  process.env.NODE_ENV = 'production';
} else {
  console.log('Running dev')
}
let PROD = process.env.NODE_ENV === 'production';

// Configuration
const src = 'app';
const config = {
  port: PROD ? 8080 : 3000,
  paths: {
    baseDir: PROD ? 'build' : 'dist',
    html: 'index.html',
    entry: src + '/index.js',
    js: src + '/**/*.js',
    css: src + '/**/*.less',
    fonts: src + '/fonts/**/*'
  }
};

// Browserify specific configuration
const b = browserify({
  entries: [config.paths.entry],
  debug: true,
  plugin: PROD ? [] : [hmr, watchify],
  cache: {},
  packageCache: {}
})
.transform('babelify');
b.on('update', bundle);
b.on('log', gutil.log);

// Copies our index.html file from the app folder to either the dist or build folder, depending on the node environment
gulp.task('html', () => {
  return gulp.src(config.paths.html)
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(cond(!PROD, livereload()));
});

// Clears the contents of the dist and build folder
gulp.task('clean', () => {
  return del(['dist/**/*', 'build/**/*']);
});


gulp.task('css', () => {
  return gulp.src(
    [
      config.paths.css
    ]
  )
  .pipe(cond(!PROD, sourcemaps.init()))
  .pipe(less())
  .on('error', gutil.log)
  .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
  .on('error', gutil.log)
  .pipe(concat('bundle.css'))
  .pipe(cond(PROD, minifyCSS()))
  .pipe(cond(!PROD, sourcemaps.write()))
  .pipe(gulp.dest(config.paths.baseDir))
  .pipe(cond(!PROD, livereload()));
});

// Linting
gulp.task('lint', () => {
  return gulp.src(config.paths.js)
  .pipe(eslint())
  .pipe(eslint.format())
});

function isFixed(file) {
	// Has ESLint fixed the file contents?
	return file.eslint != null && file.eslint.fixed;
}
gulp.task('lint-fix', () => {
  return gulp.src(config.paths.js)
  .pipe(eslint({
			fix: true
		}))
  .pipe(eslint.format())
  // if fixed, write the file to dest
	.pipe(gulpIf(isFixed, gulp.dest(src)));
});

// Bundles our JS (see the helper function at the bottom of the file)
gulp.task('js', bundle);

// Bundles our JS using browserify. Sourcemaps are used in development, while minification is used in production.
function bundle() {
  return b.bundle()
  .on('error', gutil.log.bind(gutil, 'Browserify Error'))
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(cond(PROD, minifyJS()))
  .pipe(cond(!PROD, sourcemaps.init({loadMaps: true})))
  .pipe(cond(!PROD, sourcemaps.write()))
  .pipe(gulp.dest(config.paths.baseDir));
}

// Runs an Express server defined in app.js
gulp.task('server', () => {
  nodemon({
    script: 'server.js'
  });
});

// Re-runs specific tasks when certain files are changed
gulp.task('watch', () => {
  // livereload.listen({basePath: 'dist'});
  livereload.listen({basePath: config.paths.baseDir});


  gulp.watch(config.paths.html, ['html']);
  gulp.watch(config.paths.css, ['css']);
  gulp.watch(config.paths.js, () => {
    runSequence('lint');
  });
});

// Default task, bundles the entire app and hosts it on an Express server
gulp.task('default', (cb) => {
  runSequence('clean', 'lint', 'html', 'css', 'js', 'server', 'watch', cb);
});
