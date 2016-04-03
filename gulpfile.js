(function () {

  var path = require('path');
  var gulp = require('gulp');
  var del = require('del');
  var concat = require('gulp-concat');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var umd = require('gulp-umd');
  var gulpFilter = require('gulp-filter');

  var conf = {
    src: 'src',
    dist: 'dist'
  };

  var files = {
    src: [
      conf.src + '/core/base.js',
      conf.src + '/core/event.js',
      conf.src + '/core/oop-base.js',
      conf.src + '/core/oop-define-meta.js',
      conf.src + '/core/oop.js',
      conf.src + '/amd/Path.js',
      conf.src + '/amd/Status.js',
      conf.src + '/amd/Module.js',
      conf.src + '/amd/Loader.js',
      conf.src + '/amd/index.js'
    ],
    dist: 'next-js-core2.js',
    mini: 'next-js-core2.min.js'
  };


  var filter = gulpFilter(['*'], {restore: true});

  gulp.task('clean', function () {
    return del(conf.dist);
  });

  gulp.task('uglify', ['clean'], function () {
    return gulp.src(files.src)
      .pipe(concat(files.dist))
      .pipe(filter)
      .pipe(gulp.dest('dist'))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('umd', ['uglify'], function () {
    return gulp.src('dist/*.js')
      .pipe(umd({
        dependencies: function (file) {
          return [];
        },
        exports: function (file) {
          return 'nx';
        },
        namespace: function (file) {
          return 'nx';
        }
      }))
      .pipe(gulp.dest('dist'));
  });

  gulp.task('default', ['uglify']);

}());
