const gulp = require('gulp');
const fs = require('fs');

//import
fs.readdirSync('./build').map(function (file) {
  require('./build/' + file);
});

gulp.task('default', gulp.series(['clean', 'scripts']));
