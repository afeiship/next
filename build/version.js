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

    gulp.task('bump-json', function() {
      gulp.src(['./*.json'])
        .pipe($.bump())
        .pipe(gulp.dest('./'));
    });

    gulp.task('bump-js',function(){
      gulp.src(['./src/base.js'])
      .pipe($.bump())
      .pipe(gulp.dest('./src/'));
    });

    gulp.task('bump',function(){
      gulp.start([
        'bump-json',
        'bump-js'
      ]);
    });

  }());
