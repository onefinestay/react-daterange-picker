"use strict";

var gulp = require('gulp');
var deploy = require('gulp-gh-pages');

gulp.task('deploy', function() {
  return gulp.src('./example/**/*')
    .pipe(deploy());
});
