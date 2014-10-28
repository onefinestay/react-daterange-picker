"use strict";

var fs = require('fs');
var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var sass = require('gulp-sass');
var browserify = require('browserify');
var reactify = require('reactify');
var gutil = require('gulp-util');

gulp.task('build-css', function() {
  gulp.src('./example/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('build-js', function() {
  var bundle = browserify('./example/js/index.js', {
    debug: true,
    extensions: ['.jsx', '.js'],
  });

  bundle.transform(function(file) {
    return reactify(file, {
      extension: ['jsx', 'js']
    });
  });

  var dest = fs.createWriteStream('./example/build/index.js');

  // bundle it all up
  return bundle.bundle()
    .pipe(dest);
});

gulp.task('deploy', function() {
  return gulp.src('./example/**/*')
    .pipe(deploy());
});
