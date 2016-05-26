'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var reload = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

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
  return gulp.src(['/public/scripts/**/*.js','!/public/scripts/**/*.min.js'])
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
  return gulp.src(['/public/scripts/**/*.js','!/public/scripts/min/**/*'])
    .pipe($.uglify())
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe(gulp.dest('/public/scripts/min'))
    .pipe(reload({stream: true}));
});

// Optimize Images
gulp.task('images', function () {
  return gulp.src('public/images/*.jpg')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('/public/images'))
    .pipe(reload({stream: true, once: true}))
    .pipe($.size({title: 'images'}));
});

// Automatically Prefix CSS
gulp.task('styles:css', function () {
  return gulp.src('/public/tmp/main.css')
    .pipe($.autoprefixer('last 1 version'))
    .pipe($.minifyCss())
    .pipe(gulp.dest('/public/styles/'))
    .pipe(reload({stream: true}))
    .pipe($.size({title: 'styles:css'}));
});

// Compile Any Other Sass Files You Added (/styles)
gulp.task('styles:scss', function () {
  return gulp.src('/public/styles/**/*.scss')
    .pipe($.sass())
    .on('error', function (err) {
      this.emit('end');
    })
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('/public/tmp/'))
    .pipe($.size({title: 'styles:scss'}));
});

// Output Final CSS Styles
gulp.task('styles', function (cb) {
  runSequence('styles:scss', 'styles:css', cb);
});



gulp.task('templates', function templates() {
  return gulp.src(['views/**.pug', '!views/layout.pug'])
    .pipe($.pug())
    .pipe(gulp.dest('./'));
});
/*
// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
  return gulp.src('//**//*.html')
    .pipe($.useref.assets({searchPath: '{.tmp,public}'}))
    // Concatenate And Minify JavaScript
    .pipe($.if('*.js', $.uglify()))
    // Concatenate And Minify Styles
    .pipe($.if('*.css', $.csso()))
    // Remove Any Unused CSS
    // Note: If not using the Style Guide, you can delete it from
    // the next line to only include styles your project uses.
    .pipe($.if('*.css', $.uncss({ html: ['/index.html'] })))
    .pipe($.useref.restore())
    .pipe($.useref())
    // Update Production Style Guide Paths
    .pipe($.replace('components/components.css', 'components/main.min.css'))
    // Minify Any HTML
    .pipe($.minifyHtml())
    // Output Files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});
/*/


// Watch files for changes & reload
gulp.task('serve', ['styles'], function() {
  browserSync({
    port: 5000,
    notify: false,
    logPrefix: 'PSK',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function(snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: {
      middleware: [historyApiFallback()]
    }
  });

  gulp.watch(['/**/*.html', '!bower_components/**/*.html'], reload);
  gulp.watch(['/public/styles/**/*.scss'], ['styles', reload]);
  gulp.watch(['/public/scripts/**/*.js'], reload);
  gulp.watch(['/public/images/**/*'], reload);
});

// Build Production Files, the Default Task
gulp.task('default', ['clean'], function (cb) {
  runSequence('styles', ['templates', 'jshint', 'images'], cb);
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://glanceirwcaravanpark.com',
  strategy: 'mobile'
}));
