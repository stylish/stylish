const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const express = require('express')
const lodash = require('lodash')
const isFunction = lodash.isFunction
const proxyMiddleware = require('http-proxy-middleware')

module.exports = function(argv, compilerOptions = {}) {
  if(argv.experimental) {
    return experimental(argv, compilerOptions)
  } else {
    return original(argv, compilerOptions)
  }
}

/**
 * Branching the function instead of trying to modify it
 */
function experimental(argv, {project}) {

}

function original(argv, compilerOptions = {}) {
  const { onCompile, beforeCompile } = compilerOptions

  if (!argv) { argv = require('yargs').argv }

  var app = express()

  var config = require('./index')(argv)

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig))
    config = config.merge(mod)
  }

  config = config.resolve()

  if (beforeCompile) {  beforeCompile({ config, argv }) }

  // Monkey patching the Webpack Dev Server Compiler
  // so that when the compile finishes we can do something.
  // e.g. let the skypager-electron system know the bundle is ready
  var compiler = webpack(config),
      originalWatch = compiler.watch

  compiler.watch = function(watchOptions, handler) {
    originalWatch.call(compiler, watchOptions, function(err, stats) {
      handler && handler(err, stats)

      if (onCompile && isFunction(onCompile)) {
        onCompile(err, stats)
      }

      try {
        if (argv.saveWebpackStats) {
          fs.writeFileSync(
            argv.saveWebpackStats,
            JSON.stringify(stats.toJson(), null, 2),
            ''
          )
        }
      } catch(error) {

      }
    })
  }

  // use proxyPath = '/engine.io' and proxyTarget 'http://localhost:6020'
  // to proxy the deepstream server for example
  if (argv.proxyPath && argv.proxyTarget) {
    app.use(
      proxyMiddleware(argv.proxyPath, {
        target: argv.proxyTarget,
        ws: true
      })
    )
  }

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

