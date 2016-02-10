module.exports = {
  context: __dirname,
  entry: __dirname + '/src',
  output: {
    path: __dirname + '/lib',
    filename: 'index.js',
    library: 'bundle',
    libraryTarget: 'umd'
  }
}
