const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const express = require('express')

module.exports = function(argv) {
  if (!argv) { argv = require('yargs').argv }

  var app = express()

  var config = require('./index')(argv)

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig))
    config = config.merge(mod)
  }

  config = config.resolve()

  var compiler = webpack(config)

  console.log('Config', config.output)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: !!!argv.silent,
    noInfo: !!argv.silent,
    quiet: !!argv.silent
  })

  app.use(devMiddleware)
  app.use(require('webpack-hot-middleware')(compiler))

  app.use(express.static(config.output.path))

  if (argv.middleware) {
    app.use(require(path.resolve(argv.middleware))({
      config,
      compiler
    }))
  }

  app.get('*', function(req, res) {
    if (req.accepts('html')) {
      const indexPath = path.join(config.output.path, 'index.html')
      const index = devMiddleware.fileSystem.readFileSync(indexPath)
      res.set('Content-Type', 'text/html')
      res.send(index)
    }
  })

  app.listen(argv.port || 3000, (argv.hostname || 'localhost'), function(err) {
    if (err) {
      console.log(err)
      return
    }
    if(!argv.silent) {
      console.log('Listening at http://localhost:' + (argv.port || 3000))
    }
  })
}

