'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlPlugin = HtmlPlugin;

var _lodash = require('lodash');

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function HtmlPlugin() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  (0, _lodash.defaults)(options, {
    title: 'Skypager',
    id: 'webpack-html',
    hash: false,
    inject: 'body',
    bodyScripts: [],
    staticStyles: [],
    headerScripts: [],
    googleFont: 'Roboto:300,400,500,700,400italic',
    filename: 'index.html',
    template: __dirname + '/templates/basic.html'
  });

  return function (config) {
    return config.plugin(options.id, _htmlWebpackPlugin2.default, [options]);
  };
}

exports.default = HtmlPlugin;