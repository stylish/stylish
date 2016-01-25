const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const express = require('express')

const directory = path.resolve('.')
const config = require('../index').resolve()

module.exports = function(argv) {
  if (!argv) { argv = require('yargs').argv }

  var app = express()

  var compiler = webpack(config)

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: true
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
    console.log('Listening at http://localhost:' + (argv.port || 3000))
  })
}

