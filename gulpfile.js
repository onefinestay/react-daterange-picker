"use strict";

Object.assign = require('object.assign');

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();
var React = require('react');
var webpack = require('webpack');
var KarmaServer = require('karma').Server;
var clean = require('del');

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

gulp.task('test-unit', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test-coverage', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    reporters: ['mocha', 'coverage', 'threshold'],
    singleRun: true,
    webpack: {
      module: {
        preLoaders: [{
          test: /\.(js|jsx)$/,
          include: path.resolve('src/'),
          exclude: /tests/,
          loader: 'isparta'
        }, {
          test: /\.spec.js$/,
          include: path.resolve('src/'),
          loader: 'babel'
        }],
        loaders: [
          {test: /\.(js|jsx)$/, exclude: /node_modules/, loader: require.resolve('babel-loader')}
        ]
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      }
    }
  }, done).start();
});

gulp.task('clean-dist-js', function() {
  return clean('dist');
});

gulp.task('build-dist-js', ['clean-dist-js'], function() {
  // build javascript files
  return gulp.src(['src/**/*.{js,jsx}', '!src/**/tests/**', '!src/tests.webpack.js'])
    .pipe(plugins.babel({
      stage: 1,
      plugins: ['object-assign']
    }))
    .pipe(plugins.extReplace('.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-example-js', function() {
  var compiler = plugins.webpack(webpackConfig, webpack);

  return gulp.src('./example/js/index.js')
    .pipe(compiler)
    .pipe(gulp.dest('./example/build'));
});

gulp.task('watch-example-js', function() {
  var compiler = plugins.webpack(Object.assign({}, {watch: true}, webpackConfig), webpack);
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
    .pipe(plugins.sass())
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('./example/css'));
});

gulp.task('watch-example-scss', ['build-example-scss'], function() {
  plugins.watch('./example/**/*.scss', function(files, cb) {
    gulp.start('build-example-scss', cb);
  });
});

gulp.task('example-server', function() {
  plugins.connect.server({
    root: 'example',
    port: '9989'
  });
});

gulp.task('build', ['build-dist-js', 'build-example', 'build-example-js', 'build-example-scss']);
gulp.task('develop', ['test-unit', 'build-example', 'watch-example-js', 'watch-example-scss', 'example-server']);

gulp.task('deploy-example', ['build'], function() {
  return gulp.src('./example/**/*')
    .pipe(plugins.deploy());
});
