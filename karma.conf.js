module.exports = function (config) {
  config.set({

    browsers: ['PhantomJS'],

    frameworks: ['jasmine'],

    files: [
      'node_modules/babel-core/browser-polyfill.js',
      {
        pattern: './src/tests.webpack.js',
        watched: false,
      },
    ],

    preprocessors: {
      'src/tests.webpack.js': ['webpack'],
    },

    webpack: {
      resolve: {
        extensions: ['', '.js', '.jsx'],
      },
      module: {
        loaders: [
          { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader' },
        ],
      },
      stats: {
        colors: true,
      },
      devtool: 'inline-source-map',
    },

    webpackMiddleware: {
      noInfo: true,
    },

    reporters: ['mocha'],

    mochaReporter: {
      output: 'full',
    },

    coverageReporter: {
      reporters: [
        { type: 'html', dir: 'dist/ui-coverage', subdir: 'html' },
        { type: 'cobertura', dir: 'dist/ui-coverage', subdir: 'cobertura' },
        { type: 'text-summary' },
      ],
    },

    thresholdReporter: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90,
    },
  });
};
