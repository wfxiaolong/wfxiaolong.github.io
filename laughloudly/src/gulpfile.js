var version = 'v1.0.0';
var gulp = require('gulp');
var concatFile = require('gulp-concat'),
    uglifyJS = require('gulp-uglify'),
    amdOptimize = require('amd-optimize');


gulp.task('script', function () { 
  return gulp.src('./js/**/*.js') 
            .pipe(amdOptimize('app', { 
              configFile: './js/require-config.js', 
              findNestedDependencies: true, 
              include: false
            })) 
            .pipe(concatFile('app.min.js')) 
            .pipe(uglifyJS('app.min.js')) 
            .pipe(gulp.dest('./js')); 
});

gulp.task('css', function  (argument) {
  return gulp.src('./css/mobi.css')
             .pipe(gulp.dest('../dist/' + version + '/css')); 
});

gulp.task('theme', function  (argument) {
  return gulp.src('./css/theme/*.css')
             .pipe(gulp.dest('../dist/' + version + '/css/theme')); 
});

gulp.task('tpl', function  (argument) {
  return gulp.src('./templates/**/*.html')
             .pipe(gulp.dest('../dist/' + version + '/templates')); 
});

gulp.task('index', function  (argument) {
  return gulp.src('./index.html')
             .pipe(gulp.dest('../dist/' + version)); 
});

gulp.task(version, ['script', 'css', 'theme', 'tpl']);
