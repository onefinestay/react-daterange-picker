"use strict";

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var deploy = require('gulp-gh-pages');
var sass = require('gulp-sass');
var browserify = require('browserify');
var reactify = require('reactify');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var render = require('gulp-render');
var envify = require('envify/custom');

gulp.task('build-css', function() {
  gulp.src('./example/css/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('watch-css', function() {
  watch('./example/css/*.scss', function(files, cb) {
    gulp.start('build-css', cb);
  });
});

gulp.task('build-js', function() {
  var bundle = browserify('./example/js/index.js', {
    debug: true,
    extensions: ['.jsx', '.js'],
  });

  bundle.exclude('react-daterange-picker');

  bundle.transform(function(file) {
    return reactify(file, {
      extension: ['jsx', 'js']
    });
  });

  bundle.transform({global: true}, envify({
    NODE_ENV: 'production'
  }));

  bundle.transform('brfs');

  var map = './index.js.map';
  var output = './example/build/index.js.map';

  bundle.plugin('minifyify', {
    map: map,
    output: output,
    compressPath: function(p) {
      return '/' + path.relative(__dirname, p);
    }
  });

  var dest = fs.createWriteStream('./example/build/index.js');

  // bundle it all up
  return bundle.bundle()
    .pipe(dest);
});

gulp.task('build-example', function() {
  return gulp.src('./example/index.jsx')
    .pipe(render({
      template: '<!doctype html>' +
                '<%=body%>'
    }))
    .pipe(gulp.dest('./example'));
});

gulp.task('deploy-example', ['build-js', 'build-css'], function() {
  return gulp.src('./example/**/*')
    .pipe(deploy());
});

gulp.task('deploy', ['build-js', 'build-css', 'deploy-example']);
