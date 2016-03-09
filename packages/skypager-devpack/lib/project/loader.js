'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectLoader = ProjectLoader;

var _bundle_wrapper = require('./bundle_wrapper');

var _bundle_wrapper2 = _interopRequireDefault(_bundle_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ProjectLoader(bundle) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  bundle = bundle || require('dist/bundle');

  return _bundle_wrapper2.default.create(bundle);
}

exports.default = ProjectLoader;