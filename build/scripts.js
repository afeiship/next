(function() {
  'use strict';

  var gulp = require('gulp');
  var pkgJson = require('../package.json');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
  });

  var files = [
    'src/base.js',
    'src/core.js',
    'src/event.js',
    'src/oop-base.js',
    'src/oop-reflect.js',
    'src/oop.js'
  ];

  gulp.task('scripts', function() {
    return gulp
      .src(files, { allowEmpty: true })
      .pipe($.concat('index.js'))
      .pipe($.wrap('(function() {\n<%= contents %>}.call(this));'))
      .pipe($.replace('__VERSION__', pkgJson.version))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ default size ]:' }))
      .pipe($.uglify())
      .pipe($.rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ minimize size ]:' }));
  });
})();
