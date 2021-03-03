'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];


// Lint JavaScript
gulp.task('jshint', function () {
  return gulp.src(['public/scripts/**/*.js','!public/scripts/**/*.min.js'])
    .pipe($.jshint({'predef': ['d3']}))
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe($.jshint.reporter('jshint-stylish'))
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe($.jshint.reporter('fail'))
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe(reload({stream: true}));
});

// optimize JavaScript
gulp.task('scripts', function () {
  return gulp.src(['public/scripts/**/*.js','!public/scripts/min/**/*'])
    .pipe($.uglify())
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe(gulp.dest('public/scripts/min'))
    .pipe(reload({stream: true}));
});

// Optimize Images
const images = () => {
  return gulp.src('public/images/*.jpg')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('public/images'))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: 'images'}));  
}

// Automatically Prefix CSS
const stylesCSS = () => {
  return gulp.src('public/tmp/*.css')
  .pipe($.autoprefixer('last 1 version'))
  .pipe($.minifyCss())
  .pipe(gulp.dest('public/styles/'))
  .pipe(reload({stream: true}))
  .pipe($.size({title: 'styles:css'}));
}

// Compile Any Other Sass Files You Added (/styles)
const stylesSCSS = () => {
  return gulp.src('public/styles/*.scss')
  .pipe($.sass())
  .on('error', function (err) {
    this.emit('end');
  })
  .pipe($.autoprefixer('last 1 version'))
  .pipe(gulp.dest('public/tmp/'))
  .pipe($.size({title: 'styles:scss'}))
}

// Output Final CSS Styles
const styles = () => {
  gulp.series(stylesSCSS, stylesCSS);
}

const templates = () => {
  return gulp.src(['views/**.pug', '!views/layout.pug'])
    .pipe($.pug())
    .pipe(gulp.dest('./'));
}

// Build Production Files, the Default Task
const defaultTask = (cb) => {
  gulp.series(styles, gulp.parallel(templates, images))
  cb()
}

exports.default = defaultTask