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
var proxyMiddleware = require('http-proxy-middleware');

module.exports = function (argv) {
  var compilerOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (argv.experimental) {
    return experimental(argv, compilerOptions);
  } else {
    return original(argv, compilerOptions);
  }
};

/**
 * Branching the function instead of trying to modify it
 */
function experimental(argv, _ref) {
  var project = _ref.project;
}

function original(argv) {
  var compilerOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var onCompile = compilerOptions.onCompile;
  var beforeCompile = compilerOptions.beforeCompile;

  if (!argv) {
    argv = require('yargs').argv;
  }

  var app = express();

  var config = require('./index')(argv);

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig));
    config = config.merge(mod);
  }

  config = config.resolve();

  if (beforeCompile) {
    beforeCompile({ config: config, argv: argv });
  }

  // Monkey patching the Webpack Dev Server Compiler
  // so that when the compile finishes we can do something.
  // e.g. let the skypager-electron system know the bundle is ready
  var compiler = webpack(config),
      originalWatch = compiler.watch;

  compiler.watch = function (watchOptions, handler) {
    originalWatch.call(compiler, watchOptions, function (err, stats) {
      handler && handler(err, stats);

      if (onCompile && isFunction(onCompile)) {
        onCompile(err, stats);
      }

      try {
        if (argv.saveWebpackStats) {
          fs.writeFileSync(argv.saveWebpackStats, (0, _stringify2.default)(stats.toJson(), null, 2), '');
        }
      } catch (error) {}
    });
  };

  // use proxyPath = '/engine.io' and proxyTarget 'http://localhost:6020'
  // to proxy the deepstream server for example
  if (argv.proxyPath && argv.proxyTarget) {
    app.use(proxyMiddleware(argv.proxyPath, {
      target: argv.proxyTarget,
      ws: true
    }));
  }

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
}