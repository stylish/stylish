'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebpackExporter = WebpackExporter;

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function WebpackExporter() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = params.project || this;

  var root = project.root;
  var options = project.options;
  var cacheKey = project.cacheKey;
  var paths = project.paths;

  var filename = params.filename || 'bundle.js';
  var library = params.library || filename.replace(/.js$/, '');

  var config = {
    context: project.root,
    target: 'node',
    entry: project.path('build', 'bundle', 'index.js'),
    output: {
      path: project.paths.build,
      filename: filename,
      library: library,
      libraryTarget: 'umd'
    },
    module: {
      loaders: [{ test: /\.json$/, loader: 'json' }, { test: /\.(scss)/, loader: 'style!sass' }, { test: /\.(less)/, loader: 'style!less' }, { test: /\.css/, loader: 'style' }]
    }
  };

  require('webpack')(config).run(function (err, stats) {
    if (err) {
      console.log(err);
    }
  });
}