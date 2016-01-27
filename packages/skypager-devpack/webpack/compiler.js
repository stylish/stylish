const path = require('path')
const webpack = require('webpack')

module.exports = function(argv) {
  if (!argv) { argv = require('yargs').argv }

  var config = require('./index')(argv)

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig))
    config = config.merge(mod)
  }

  config = config.resolve()

  if (argv.platform === 'electron') {
    config.output.publicPath = ''
  }

  var compiler = webpack(config)

  compiler.run((err, stats) => {
    if (err) {
      console.log(err)
      process.exit(1)
    } else {
      process.exit(0)
    }
  })
}
