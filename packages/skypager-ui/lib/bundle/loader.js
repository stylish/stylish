'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectLoader = ProjectLoader;

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ProjectLoader(bundle) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return _wrapper2.default.create(bundle);
}

exports.default = ProjectLoader;