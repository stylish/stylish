'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.BrowserBundle = BrowserBundle;
exports.AssetExporter = AssetExporter;
exports.ProjectExporter = ProjectExporter;

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IncludeData = ['data_sources', 'settings_files', 'copy_files', 'documents'];
var IncludeExporters = ['entities', 'settings', 'copy'];
var AssetFields = ['id', 'assetGroup', 'categoryFolder', 'fingerprint', 'paths'];
var IncludeCollections = ['documents', 'data_sources', 'copy_files', 'settings_files', 'scripts', 'stylesheets', 'packages', 'projects', 'vectors'];

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

  var output = (0, _pick2.default)(asset, AssetFields);

  if (IncludeData.indexOf(asset.assetGroup) >= 0) {
    output = (0, _assign2.default)(output, {
      data: asset.data
    });
  }

  if (asset.assetGroup === 'vectors') {
    output = (0, _assign2.default)(output, {
      raw: asset.raw.replace(/^\uFEFF/, '')
    });
  }

  if (asset.assetGroup === 'documents') {
    output = (0, _assign2.default)(output, {
      markdown: asset.raw,
      ast: asset.indexed,
      indexes: asset.indexes,
      html: asset.html.content,
      data: asset.data || asset.metadata,
      title: attempt(function () {
        return asset.documentTitle;
      }),
      mainCopy: attempt(function () {
        return asset.mainCopy;
      })
    });
  }

  write(outPath, 'module.exports = ' + (0, _stringify2.default)(output) + ';');

  return {
    requirePath: requirePath
  };
}

function ProjectExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var project = options.project;

  if (options.runIncluded !== false) {
    IncludeExporters.forEach(function (exporter) {
      return runAndSave(project, exporter);
    });
  }

  var lines = [contextPolyfill(), 'var bundle = module.exports = {bundleApi:2, content: {}};'];

  lines.push('try { bundle.entities = require(\'./entities-export.json\'); } catch(error) { bundle.entities = {error: error.message} }', 'try { bundle.settings = require(\'./settings-export.json\'); } catch(error) { bundle.settings = {error: error.message} }', 'try { bundle.copy = require(\'./copy-export.json\'); } catch(error) { bundle.copy = {error: error.message} }', 'bundle.requireContexts = {\n      scripts: require.context(\'' + project.scripts.paths.absolute + '\', true, /.js$/i),\n      stylesheets: require.context(\'' + project.stylesheets.paths.absolute + '\', true, /..*ss$/i)\n    };');

  IncludeCollections.forEach(function (key) {
    lines.push('var _' + key + ' = bundle.content.' + key + ' = {};');

    if (!project.content[key]) {
      console.error('No such content colection', key, (0, _keys2.default)(project.content));
      throw 'No such content collection ' + key;
    }

    project.content[key].forEach(function (asset) {
      var _AssetExporter$call = AssetExporter.call(project, { asset: asset, options: options, key: key });

      var requirePath = _AssetExporter$call.requirePath;

      lines.push('_' + key + '[\'' + asset.id + '\'] = require(\'./' + requirePath + '\');');
    });
  });

  lines.push('module.exports = bundle');

  return write(project.path('build', 'bundle', 'index.js'), lines.join("\n"));
}

exports.default = BrowserBundle;

function runAndSave(project, exporter) {
  write(project.path('build', 'bundle', exporter + '-export.json'), (0, _stringify2.default)(project.run.exporter(exporter)));
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

function contextPolyfill() {
  return;
  'if (typeof require.context === \'undefined\') {\n  require.context = function(){\n    return {\n      keys:function(){ return [] },\n      req:function(){}\n    }\n  }\n}';
}

function attempt(fn) {
  try {
    return fn();
  } catch (error) {}
}