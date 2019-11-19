(function() {
  'use strict';

  var gulp = require('gulp');
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
  });

  /**
   * @thanks to:
   * http://www.jianshu.com/p/d616d3bf391f
   */

  gulp.task('bump', function() {
    return gulp
      .src(['./*.json'])
      .pipe($.bump())
      .pipe(gulp.dest('./'));
  });
})();
