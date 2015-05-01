var webpack = require('webpack');

module.exports = {
  cache: true,
  context: __dirname,
  entry: './example/js/index.js',
  output: {
    path: './example/build/',
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        exclude: /node_modules\//,
        loaders: [
          'babel-loader?stage=1'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\//,
        loaders: [
          'babel-loader?stage=1'
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
  plugins: [
    // Fix for moment including all locales
    // Ref: http://stackoverflow.com/a/25426019
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};
