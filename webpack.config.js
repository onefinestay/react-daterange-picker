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
          '6to5-loader?experimental=true&runtime=true'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules\//,
        loaders: [
          '6to5-loader?experimental=true&react=false&runtime=true'
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
  }
};
