'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Streamer = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Streamer = exports.Streamer = (function () {
  function Streamer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Streamer);

    this.root = options.root;
    this.writers = {};
    this.readers = {};
  }

  (0, _createClass3.default)(Streamer, [{
    key: 'read',
    value: function read(name) {
      if (this.readers[name]) {
        return this.readers[name];
      }

      var path = (0, _path.join)(this.root, 'streamer-' + name + '.log');

      if (!(0, _fs.existsSync)(path)) {
        (0, _fs.writeFileSync)(path, '', 'utf8');
      }

      return this.readers[name] = (0, _fs.createReadStream)(path);
    }
  }, {
    key: 'write',
    value: function write(name) {
      if (this.writers[name]) {
        return this.writers[name];
      }

      return this.writers[name] = (0, _fs.createWriteStream)((0, _path.join)(this.root, 'streamer-' + name + '.log'));
    }
  }]);
  return Streamer;
})();