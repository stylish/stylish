'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var express = require('express');
var lodash = require('lodash');
var isFunction = lodash.isFunction;

module.exports = function (argv, serverOptions) {
  serverOptions = serverOptions || {};
  if (!argv) {
    argv = require('yargs').argv;
  }

  if (argv.preset && argv.project) {
    argv = require('../lib').devpack('serve', argv.env || process.env.NODE_ENV, argv.project, require('yargs').argv);
  }

  var app = express();

  var config = require('./index')(argv);

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig));
    config = config.merge(mod);
  }

  config = config.resolve();

  // Monkey patching the Webpack Dev Server Compiler
  // so that when the compile finishes we can do something.
  // e.g. let the skypager-electron system know the bundle is ready
  var compiler = webpack(config),
      originalWatch = compiler.watch;

  compiler.watch = function (watchOptions, handler) {
    originalWatch.call(compiler, watchOptions, function (err, stats) {
      handler && handler(err, stats);

      if (serverOptions.onCompile && isFunction(serverOptions.onCompile)) {
        serverOptions.onCompile(err, stats);
      }

      try {
        if (argv.saveWebpackStats) {
          fs.writeFileSync(argv.saveWebpackStats, (0, _stringify2.default)(stats.toJson(), null, 2), '');
        }
      } catch (error) {
        console.error('ERRROR', error.message);
        fs.writeFileSync('/Users/jonathan/Skypager/error.txt', error.message);
      }
    });
  };

  var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: config.output.publicPath,
    stats: !!!argv.silent,
    noInfo: !!argv.silent,
    quiet: !!argv.silent
  });

  app.use(devMiddleware);
  app.use(require('webpack-hot-middleware')(compiler));

  app.use(express.static(config.output.path));

  if (argv.middleware) {
    app.use(require(path.resolve(argv.middleware))({
      config: config,
      compiler: compiler
    }));
  }

  app.get('*', function (req, res) {
    if (req.accepts('html')) {
      var indexPath = path.join(config.output.path, 'index.html');
      var index = devMiddleware.fileSystem.readFileSync(indexPath);
      res.set('Content-Type', 'text/html');
      res.send(index);
    }
  });

  app.listen(argv.port || 3000, argv.hostname || 'localhost', function (err) {
    if (err) {
      console.log(err);
      return;
    }
    if (!argv.silent) {
      console.log('Listening at http://localhost:' + (argv.port || 3000));
    }
  });
};