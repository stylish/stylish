'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.exporter = exporter;
exports.handle = handle;

var _path = require('path');

var _fs = require('fs');

var _yargs = require('yargs');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exporter(program, dispatch) {
  program.command('export <exporter>').description('run one of the project exporters').option('--format <format>', 'which format should the output be serialized in', 'json').option('--output <path>', 'where to save the contents').option('--pretty', 'pretty print the output').option('--stdout', 'write output to stdout').option('--benchmark', 'include benchmarking information').option('--watch', 'watch files for changes and rerun the exporter').option('--clean', 'clean or remove previous versions first').action(dispatch(handle));
}

exports.default = exporter;
function handle(exporterId) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  console.log('Running exporter: ' + exporterId.cyan);
  actuallyHandle(exporterId, options, context);

  if (options.watch) {
    var files = './{data,docs,settings,src,assets,models,actions,exporters,importers}/**/*.*';
    var watcher = require('chokidar').watch(files, {
      usePolling: true,
      interval: 200,
      debounce: 1200
    });

    options.watch = false;

    var onChange = function onChange() {
      actuallyHandle(exporterId, options, context);
    };

    watcher.on('change', (0, _debounce2.default)(onChange, 300));
  }
}

function actuallyHandle(exporterId) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  var exporter = project.registries.exporters.lookup(exporterId, false);

  if (!exporter) {
    abort('could not find and exporter named ' + exporterId);
  }

  var params = (0, _assign2.default)({}, _yargs.argv, { project: project });

  if (options.clean && exporterId === 'bundle') {
    require('rimraf').sync(project.path('build', 'bundle'));
  }

  if (options.benchmark) {
    console.time('exporter');
  }

  var payload = project.run.exporter(exporterId, params);

  var output = undefined;

  if (options.format === 'json' && options.pretty) {
    output = (0, _stringify2.default)(payload, null, 2);
  } else if (options.format === 'json') {
    output = (0, _stringify2.default)(payload);
  } else if (options.format === 'yaml') {
    output = yaml.dump(payload);
  }

  if (options.output) {
    var outputPath = (0, _path.resolve)((0, _path.normalize)(options.output));
    (0, _fs.writeFileSync)(outputPath, output.toString(), 'utf8');
  } else if (options.stdout) {
    console.log(output);
  }

  if (options.benchmark) {
    console.timeEnd('exporter');
  }
}

function abort(message) {
  console.log(message.red);
  process.exit(0);
}