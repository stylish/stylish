'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function environment(pwd) {
  pwd = pwd || process.env.PWD;

  if (require('fs').existsSync(pwd + '/.env')) {
    _dotenv2.default.load(pwd + '/.env');
  }
};