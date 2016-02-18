'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.available = available;
exports.handle = handle;

var _util = require('../util');

function available(program, dispatch) {
  program.command('available [helperType]').description('list available helpers in this project').option('--type <helperType>', 'the type of helpers you want to list. valid options are action, context, exporter, importer, model, plugin, renderer, store, view').action(dispatch(handle));
}

exports.default = available;
function handle(type) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var helperType = type || options.type;
  var project = context.project;

  helperType = (0, _util.pluralize)(helperType).toLowerCase();

  console.log(('Available ' + helperType).green + ':');

  var registry = project.registries[helperType];

  registry.available.sort().forEach(function (val) {
    console.log(val);
  });
}