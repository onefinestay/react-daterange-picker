"use strict";

Object.assign = require('object.assign');

var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var extReplace = require('gulp-ext-replace');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var render = require('gulp-render');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var deploy = require('gulp-gh-pages');

gulp.task('build-js', function() {
  // build javascript files
  return gulp.src('src/**/*.{js,jsx}')
    .pipe(babel({
      stage: 1,
      plugins: ['object-assign']
    }))
    .pipe(extReplace('.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch-js', function() {
  // watch js files
  watch('./src/*{js,jsx}', function(files, cb) {
    gulp.start('build-js', cb);
  });
});

gulp.task('build-example', ['build-js'], function() {
  return gulp.src('./example/index.jsx')
    .pipe(babel({
      stage: 1,
      plugins: ['object-assign']
    }))
    .pipe(render({
      template: '<!doctype html>' +
                '<%=body%>'
      }))
    .pipe(gulp.dest('./example'));
});

gulp.task('build-example-scss', function() {
  gulp.src('./example/css/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('watch-example', ['build-js', 'build-example'], function() {
  watch(
    ['./example/**/*.{js,jsx}', './src/*.{js,jsx}', '!./example/build/*.js', '!./example/js/*.js'],
    function(files, cb) {
      // delete all files in require cache
      for (var i in require.cache) {
        if (!i.match(/node_modules/) && !i.match(/gulpfile/)) {
          delete require.cache[i];
        }
      }

      gulp.start('build-example', cb);
    }
  );
});

gulp.task('watch-example-scss', ['build-example-scss'], function() {
  watch('./example/**/*.scss', function(files, cb) {
    gulp.start('build-example-scss', cb);
  });
});

gulp.task('example-server', function() {
  connect.server({
    root: 'example',
    port: '9989'
  });
});

gulp.task('build', ['build-js', 'build-example', 'build-example-scss']);

gulp.task('develop-example', ['build-example', 'build-example-scss', 'watch-example', 'watch-example-scss', 'example-server']);

gulp.task('develop', ['watch-js', 'watch-example', 'watch-example-scss', 'example-server']);

gulp.task('deploy-example', ['build'], function() {
  return gulp.src('./example/**/*')
    .pipe(deploy());
});
