(function () {

  'use strict';

  var rootPath = process.cwd();
  var gulp = require('gulp');
  var argv = require('yargs').argv;
  var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'del']
  });

  module.exports = {
    path: {
      root: rootPath,
      src: rootPath + '/src',
      dist: rootPath + '/dist',
      gulp: rootPath + '/gulp'
    },
    sassOptions: {
      normal: {
        outputStyle: 'expanded'/* nested | expanded | compact | compressed */
      },
      minify: {
        outputStyle: 'compressed'
      }
    },
    files: {
      src: [
        'src/base.js',
        'src/event.js',
        'src/oop-base.js',
        'src/oop-reflect.js',
        'src/oop.js'
      ],
      dist: 'next-js-core2.js'
    }
  };

}());
