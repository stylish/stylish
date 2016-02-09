'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EXPORTERS = undefined;
exports.ExportAll = ExportAll;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXPORTERS = exports.EXPORTERS = ['assets', 'content', 'entities', 'models', 'project'];

function ExportAll() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = params.project = params.project || this;

  project.allAssets.forEach(function (asset) {
    try {
      if (!asset.raw) {
        asset.runImporter('disk', { sync: true });
      }
    } catch (error) {
      console.log('error importing asset: ' + asset.id);
      throw error;
    }
  });

  return EXPORTERS.reduce(function (memo, exporter) {
    return (0, _assign2.default)(memo, (0, _defineProperty3.default)({}, exporter, project.run.exporter(exporter, params)));
  }, {});
}

exports.default = ExportAll;