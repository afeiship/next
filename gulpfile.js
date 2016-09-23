(function() {

  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var umd = require('gulp-umd');

  var conf = {
    src: 'src',
    dist: 'dist'
  };

  var files = {
    src: [
      'src/base.js',
      'src/event.js',
      'src/oop-base.js',
      'src/oop-define-meta.js',
      'src/oop.js'
    ],
    dist: 'next-js-core2.js'
  };

  gulp.task('clean', function() {
    return del(conf.dist);
  });

  gulp.task('scripts', ['clean'], function() {
    return gulp.src(files.src)
      .pipe(concat(files.dist))
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['scripts']);

}());
