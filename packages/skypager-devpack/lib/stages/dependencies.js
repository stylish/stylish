'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dependencies = Dependencies;
exports.validate = validate;

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _dependencies = require('dist/settings/dependencies');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Including the bundling and optimization of third party libraries
 * such as React, Bootstrap, or jQuery should not be something we need
 * to do in every development session.  We should let the system handle caching
 * these builds for us in order to optimize development build times.
 *
 * Webpack can handle this in multiple ways with different configuration options
 * and plugin combinations.
 *
 * We can also precompile HTML templates and the dependency bundles, and only inject
 * our Webpack Entry script in development, so that we can develop and get hot reloading
 * feedback in the browser with near instantaneous updates.
 */

function Dependencies() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!validate(options)) {
    return;
  }

  var bundle = options.bundle;

  var vendor = _dependencies.bundles[bundle];

  return function (config) {
    config.merge({
      entry: {
        vendor: vendor
      }
    });
  };
}

function validate() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var report = arguments[1];

  if (!_dependencies.bundles[options.bundle]) {
    report.error('Invalid dependency bundle selected');
  }

  return report.valid;
}

exports.default = Dependencies;