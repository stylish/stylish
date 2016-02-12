'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// instead of cache https://github.com/webpack/webpack/tree/master/examples/dll
var path = require('path');
var webpack = require('webpack');
var md5 = require('md5');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');

module.exports = function (argv) {
  if (!argv) {
    argv = require('yargs').argv;
  }

  if (argv.preset && argv.project) {
    argv = require('../lib').devpack('build', argv.env || process.env.NODE_ENV, argv.project, require('yargs').argv);
  }

  var config = require('./index')(argv);

  if (argv.webpackConfig) {
    var mod = require(path.resolve(argv.webpackConfig));
    config = config.merge(mod);
  }

  config = config.resolve();

  config.devtool = 'eval';

  if (argv.platform === 'electron') {
    config.output.publicPath = '';
  }

  try {
    var compiler = webpack(config);
  } catch (e) {
    console.log('Error', e.message);
  }

  compiler.run(function (err, stats) {
    var compilation = stats.compilation,
        errors = compilation.errors,
        warnings = compilation.warnings;

    if (err) {
      console.log(err);
      process.exit(1);
    } else {

      if (errors && errors.length > 0) {
        console.log(('Compilation had ' + errors.length + ' errors.').red);

        errors.forEach(function (error) {
          console.log("\n----\n\n");
          console.log(error);
        });

        console.log("\n----\n\n");
      }

      if (warnings && warnings.length > 0) {
        console.log(('Compilation had ' + warnings.length + ' warnings.').yellow);

        warnings.forEach(function (error) {
          console.log("\n----\n\n");
          console.log(error);
        });

        console.log("\n----\n\n");
      }

      if (argv.debug) {
        console.log((0, _stringify2.default)(compilation.getStats().toJson(), null, 2));
      }

      process.exit(0);
    }
  });
};