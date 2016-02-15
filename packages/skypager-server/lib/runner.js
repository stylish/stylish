"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProcessRunner = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProcessRunner = exports.ProcessRunner = function ProcessRunner(_ref) {
  var project = _ref.project;
  var streamer = _ref.streamer;
  (0, _classCallCheck3.default)(this, ProcessRunner);

  this.project = project;
  this.streamer = streamer;
};

exports.default = ProcessRunner;