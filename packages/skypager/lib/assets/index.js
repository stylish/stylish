'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _util = require('../util');

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _data_source = require('./data_source');

var _data_source2 = _interopRequireDefault(_data_source);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _script = require('./script');

var _script2 = _interopRequireDefault(_script);

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _vector = require('./vector');

var _vector2 = _interopRequireDefault(_vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _assign2.default)(_asset2.default, {
  get SupportedExtensions() {
    return [].concat(_asset2.default.EXTENSIONS, _data_source2.default.EXTENSIONS, _document2.default.EXTENSIONS, _image2.default.EXTENSIONS, _script2.default.EXTENSIONS, _stylesheet2.default.EXTENSIONS, _vector2.default.EXTENSIONS).map(function (v) {
      return "." + v;
    });
  }
});

module.exports = {
  Asset: _asset2.default,
  DataSource: _data_source2.default,
  Document: _document2.default,
  Image: _image2.default,
  Script: _script2.default,
  Stylesheet: _stylesheet2.default,
  Vector: _vector2.default
};