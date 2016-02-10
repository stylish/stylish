'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.BrowserBundle = BrowserBundle;
exports.AssetExporter = AssetExporter;
exports.ProjectExporter = ProjectExporter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BundleWrapperPath = require('path').resolve('../../lib/bundle.js');
function BrowserBundle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project = this;

  if (options.asset && options.collection) {
    return AssetExporter.apply(project, arguments);
  }

  if (options.project) {
    return ProjectExporter.apply(project, arguments);
  }
}

function AssetExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var project = this;
  var asset = options.asset;

  if (!asset.raw) {
    asset.runImporter('disk', { sync: true });
  }

  // temp disable
  var requirePath = asset.fingerprint && false ? asset.paths.project.replace(/\.\w+$/, '-' + asset.fingerprint.substr(0, 6) + '.js') : asset.paths.project.replace(/\.\w+$/, '.js');

  var outPath = project.path('build', 'bundle', requirePath);

  /*if (exists(outPath)) {
    return { requirePath }
  }*/

  var output = {
    id: asset.id,
    paths: asset.paths,
    assetGroup: asset.assetGroup,
    fingerprint: asset.fingerprint
  };

  if (asset.assetGroup === 'data_sources') {
    output = (0, _assign2.default)(output, {
      data: asset.data
    });
  }

  if (asset.assetGroup === 'documents') {
    output = (0, _assign2.default)(output, {
      markdown: asset.raw,
      ast: asset.indexed,
      indexes: asset.indexes,
      html: asset.html.content
    });
  }

  write(outPath, 'module.exports = ' + (0, _stringify2.default)(output) + ';');

  return {
    requirePath: requirePath
  };
}

var IncludeExporters = ['assets', 'entities', 'project', 'models'];

function ProjectExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var project = options.project;

  if (options.runIncluded !== false) {
    IncludeExporters.forEach(function (exporter) {
      return runAndSave(project, exporter, options);
    });
  }

  var lines = ['var bundle = module.exports = {};', 'bundle.project = require(\'./project-export.json\');', 'bundle.entities = require(\'./entities-export.json\');', 'bundle.assets = require(\'./assets-export.json\');', 'bundle.models = require(\'./models-export.json\');', '\n    bundle.requireContexts = {\n      scripts: require.context(\'' + project.scripts.paths.absolute + '\', true, /.js$/i),\n      stylesheets: require.context(\'' + project.stylesheets.paths.absolute + '\', true, /..*ss$/i)\n    };\n    bundle.content = {}'];

  keys(project.content).forEach(function (key) {
    lines.push('var _' + key + ' = bundle.content.' + key + ' = {};');

    project.content[key].forEach(function (asset) {
      var _AssetExporter$call = AssetExporter.call(project, { asset: asset, options: options, key: key });

      var requirePath = _AssetExporter$call.requirePath;

      lines.push('_' + key + '[\'' + asset.id + '\'] = require(\'./' + requirePath + '\');');
    });
  });

  lines.push('module.exports = require(\'skypager/lib/bundle\').create(bundle)');

  return write(project.path('build', 'bundle', 'index.js'), lines.join("\n"));
}

exports.default = BrowserBundle;

function runAndSave(project, exporter, options) {
  write(project.path('build', 'bundle', exporter + '-export.json'), (0, _stringify2.default)(project.run.exporter(exporter, options)));
}

function mkdir() {
  var _require;

  return (_require = require('mkdirp')).sync.apply(_require, arguments);
}

function write(path, contents) {
  mkdir(require('path').dirname(path));
  require('fs').writeFileSync(path, contents, 'utf8');

  return contents;
}

function exists() {
  var _require2;

  return (_require2 = require('fs')).existsSync.apply(_require2, arguments);
}

function generateRequireContexts(project) {}

var _Object = Object;
var keys = _Object.keys;