"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

exports.ProjectExporter = ProjectExporter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Serialize import project information into a JSON Object.
 *
 * @param {Array} includeData which project datasources to include
 *
 */
function ProjectExporter() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = params.project || this;

  var root = project.root;
  var options = project.options;
  var cacheKey = project.cacheKey;
  var paths = project.paths;

  var data = {};

  if (options.includeData) {
    options.includeData.forEach(function (dataSourceId) {
      var dataSource = project.data_sources.at(dataSourceId);
      data[dataSourceId] = dataSource.data;
    });
  }

  return (0, _assign2.default)(data, {
    options: options,
    cacheKey: cacheKey,
    paths: paths,
    root: root
  });
}

exports.default = ProjectExporter;