module.exports = {
  content: __dirname,
  target: 'node',
  entry: __dirname + './fixture/dist/bundle/index',
  output: {
    path: './fixture/dist',
    filename: 'bundle.js',
    library: 'bundle',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},
      {test: /\.js$/, loader: 'babel'}
    ]
  }
}
