// Karma configuration
// Generated on Sat Dec 12 2015 12:19:51 GMT-0700 (MST)

const path = require('path');
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'karma.webpack.config.js',
    ],
    exclude: [
    ],
    plugins: [
      'karma-jasmine',
      'karma-firefox-launcher',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
    ],
    preprocessors: {
      'karma.webpack.config.js': ['webpack', 'sourcemap'], // preprocess with webpack and our sourcemap loader
    },
    coverageReporter: {
      type: 'text',
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map', // just do inline source maps instead of the default
      module: {
        loaders: [
          {
            loader: 'babel-loader',
            test: /\.jsx?$/,
            exclude: /node_modules/,
          },
        ],
        postLoaders: [
          {
            loader: 'istanbul-instrumenter',
            include: path.resolve('src/'),
            test: /\.js$/,
          },
        ],
      },
      resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js'],
        root: [path.resolve(__dirname, 'src/')],
      },
    },
    webpackServer: {
      noInfo: true,
    },
  });
};
