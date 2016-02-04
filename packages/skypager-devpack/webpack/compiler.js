// instead of cache https://github.com/webpack/webpack/tree/master/examples/dll
const path = require('path')
const webpack = require('webpack')
const md5 = require('md5')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = function(argv) {
  if (!argv) { argv = require('yargs').argv }

  var config = require('./index')(argv)

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig))
    config = config.merge(mod)
  }

  config = config.resolve()

  config.devtool = 'eval'

  if (argv.platform === 'electron') {
    config.output.publicPath = ''
  }

  try {
    var compiler = webpack(config)
  } catch (e) {
    console.log('Error', e.message)
  }

  compiler.run((err, stats) => {
    var compilation = stats.compilation,
        errors = compilation.errors,
        warnings = compilation.warnings;

    if (err) {
      console.log(err)
      process.exit(1)
    } else {

      if (errors && errors.length > 0) {
        console.log(`Compilation had ${ errors.length } errors.`.red);

        errors.forEach(function(error){
          console.log("\n----\n\n")
          console.log(error)
        })

        console.log("\n----\n\n")
      }

      if (warnings && warnings.length > 0) {
        console.log(`Compilation had ${ warnings.length } warnings.`.yellow);

        warnings.forEach(function(error){
          console.log("\n----\n\n")
          console.log(error)
        })

        console.log("\n----\n\n")
      }


      process.exit(0)
    }
  })
}