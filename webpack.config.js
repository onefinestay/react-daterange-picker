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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: [
          'jsx?harmony&sourceMap=true'
        ]
      }
    ],
    postLoaders: [
      {
        loader: "transform/cacheable?brfs"
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
};
