'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = updatePackageManifest;

function updatePackageManifest() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var merge = require('lodash/object/merge');
  var doc = options.document || options.asset;
  var fs = require('fs-promise');

  (0, _assign2.default)(doc, {
    updateManifest: function updateManifest() {
      var changes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var data = doc.sourcePath && doc.readManifest();
      var nextData = merge(data, changes);

      fs.writeFile(doc.manifestPath, (0, _stringify2.default)(nextData, null, 2)).then(function (result) {
        console.log('Updated ' + doc.sourcePath);
      });
    }
  });
}