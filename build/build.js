(function() {

  'use strict';

  var gulp = require('gulp');

  gulp.task('build', ['clean'], function() {
    // console.log('Your task goes here!');
    gulp.start(['scripts']);
  });

}());
