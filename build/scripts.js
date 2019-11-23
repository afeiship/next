(function() {
  'use strict';

  var gulp = require('gulp');
  var pkgJson = require('../package.json');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
  });

  var files = [
    'src/base.js',
    'src/event.js',
    'src/oop-base.js',
    'src/oop-reflect.js',
    'src/oop.js'
  ];

  gulp.task('scripts', function() {
    return gulp
      .src(files, { allowEmpty: true })
      .pipe($.concat('next-js-core2.js'))
      .pipe($.replace('__VERSION__', pkgJson.version))
      .pipe($.umd({ namespace: () => 'nx', exports: () => 'nx' }))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ default size ]:' }))
      .pipe($.uglify())
      .pipe($.rename({ extname: '.min.js' }))
      .pipe(gulp.dest('dist'))
      .pipe($.size({ title: '[ minimize size ]:' }));
  });
})();
