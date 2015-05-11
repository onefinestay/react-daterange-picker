"use strict";

Object.assign = require('object.assign');

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var extReplace = require('gulp-ext-replace');
var watch = require('gulp-watch');
var babel = require('gulp-babel');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var deploy = require('gulp-gh-pages');
var React = require('react');
var webpack = require('webpack');
var gulpWebpack = require('gulp-webpack');

var PRODUCTION = (process.env.NODE_ENV === 'production');

var gulpPlugins = [
  // Fix for moment including all locales
  // Ref: http://stackoverflow.com/a/25426019
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

if (PRODUCTION) {
  gulpPlugins.push(new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify("production")
    }
  }));
  gulpPlugins.push(new webpack.optimize.DedupePlugin());
  gulpPlugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: true,
    mangle: true,
    sourceMap: true
  }));
}

var webpackConfig = {
  cache: true,
  debug: !PRODUCTION,
  devtool: PRODUCTION ? 'source-map' : 'eval-source-map',
  context: __dirname,
  output: {
    path: path.resolve('./example/build/'),
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx|.js$/,
        exclude: /node_modules\//,
        loaders: [
          'babel-loader?stage=1&plugins[]=object-assign'
        ]
      },
    ],
    postLoaders: [
      {
        loader: "transform/cacheable?brfs"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: gulpPlugins
};

gulp.task('build-dist-js', function() {
  // build javascript files
  return gulp.src('src/**/*.{js,jsx}')
    .pipe(babel({
      stage: 1,
      plugins: ['object-assign']
    }))
    .pipe(extReplace('.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-example-js', function() {
  var compiler = gulpWebpack(webpackConfig, webpack);

  return gulp.src('./example/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./example/build'));
});

gulp.task('watch-example-js', function() {
  var compiler = gulpWebpack(Object.assign({}, {watch: true}, webpackConfig), webpack);
  return gulp.src('./example/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./example/build'));
});

gulp.task('build-example', function() {
  // setup babel hook
  require("babel/register")({
    stage: 1,
    plugins: ['object-assign']
  });

  var Index = React.createFactory(require('./example/base.jsx'));
  var markup = '<!document html>' + React.renderToString(Index());

  // write file
  fs.writeFileSync('./example/index.html', markup);
});

gulp.task('build-example-scss', function() {
  gulp.src('./example/css/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./example/css'));
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

gulp.task('build', ['build-dist-js', 'build-example', 'build-example-js', 'build-example-scss']);
gulp.task('develop', ['build-example', 'watch-example-js', 'watch-example-scss', 'example-server']);

gulp.task('deploy-example', ['build'], function() {
  return gulp.src('./example/**/*')
    .pipe(deploy());
});
