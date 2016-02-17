module.exports = {
  context: __dirname,
  target: 'node',
  entry: __dirname + '/fixture/dist/bundle/index',
  output: {
    path: __dirname + '/fixture/dist',
    filename: 'bundle.js',
    library: 'bundle',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},
      {test: /\.(scss)/, loader: 'style!sass'}
    ]
  }
}
