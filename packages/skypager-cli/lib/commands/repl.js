'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.repl = repl;
exports.handle = handle;

var _nodeEmoji = require('node-emoji');

var _nodeEmoji2 = _interopRequireDefault(_nodeEmoji);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _invoke = require('lodash/invoke');

var _invoke2 = _interopRequireDefault(_invoke);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('colors');

function repl(program, dispatch) {
  program.command('console').description('Run an interactive REPL within the project').option('--es6', 'require babel-register and polyfill').action(dispatch(handle));
}

exports.default = repl;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var project = context.project;

  options = (0, _defaults2.default)(options, {
    color: process.env.SKYPAGER_CLI_BRAND_COLOR,
    icon: process.env.SKYPAGER_CLI_BRAND_ICON,
    brand: process.env.SKYPAGER_CLI_BRAND || process.env.SKYPAGER_CLI_BRAND_NAME
  }, {
    color: project && project.get('options.brand.color') || 'cyan',
    icon: project && project.get('options.brand.icon') || 'rocket',
    brand: project && project.get('options.brand.name') || 'skypager'
  });

  var _options = options;
  var icon = _options.icon;
  var brand = _options.brand;
  var color = _options.color;

  if (options.icon) {
    icon = _nodeEmoji2.default.get(icon) || 'rocket';
  }

  var prompt = (brand || 'skypager')[color] || (brand || 'skypager').cyan;

  var replServer = require('repl').start({
    prompt: icon + ' ' + prompt + ': '
  });

  replServer.context['framework'] = replServer.context['skypager'] = (0, _util.loadSkypagerFramework)();

  (0, _keys2.default)(context).forEach(function (key) {
    replServer.context[key] = context[key];
    replServer.context.contextKeys = (0, _keys2.default)(context);
  });
}