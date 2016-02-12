let config = {
  target: 'node',
  output: {
    filename: 'bundle.js',
    library: 'bundle',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {test: /\.json$/, loader: 'json'},

    ]
  }
}
