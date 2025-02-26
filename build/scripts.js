const gulp = require('gulp');
const pkgJson = require('../package.json');
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*', 'del']
});

const files = [
  'src/base.js',
  'src/core.js',
  'src/oop-base.js',
  'src/oop-reflect.js',
  'src/oop.js'
];

gulp.task('scripts', function () {
  return gulp
    .src(files)
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
