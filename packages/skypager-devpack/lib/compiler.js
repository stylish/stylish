const path = require('path')
const webpack = require('webpack')

module.exports = function(argv) {
  if (!argv) { argv = require('yargs').argv }

  var config = require('../index').resolve()
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
