'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.express = express;

var _express2 = require('express');

var _express3 = _interopRequireDefault(_express2);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _expressWinston = require('express-winston');

var _expressWinston2 = _interopRequireDefault(_expressWinston);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function express(server) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app = (0, _express3.default)();
  var config = server.config;

  if (!config) {
    throw 'no config';
  }

  if (config.deepstream) {
    setupDeepstreamProxy(app, (0, _defaults2.default)({}, config.deepstream, {
      path: '/engine.io',
      port: 6020,
      host: '0.0.0.0'
    }), server);
  }

  app.use(_express3.default.static(server.paths.public));

  if (config.api) {
    setupExpressAPI(app, (0, _defaults2.default)({}, config.api, {}), server);
  }

  if (config.webpack) {
    setupWebpackProxy(app, config.webpack, server);
  }

  return app;
}

exports.default = express;

function setupWebpackProxy(app, _ref) {
  var _ref$path = _ref.path;
  var path = _ref$path === undefined ? '/' : _ref$path;
  var _ref$host = _ref.host;
  var host = _ref$host === undefined ? 'localhost' : _ref$host;
  var _ref$port = _ref.port;
  var port = _ref$port === undefined ? 3000 : _ref$port;
  var _ref$proto = _ref.proto;
  var proto = _ref$proto === undefined ? 'http' : _ref$proto;

  var target = proto + '://' + host + ':' + port;

  app.use((0, _httpProxyMiddleware2.default)(path, {
    target: target,
    ws: true
  }));
}

function setupDeepstreamProxy(app, _ref2) {
  var _ref2$path = _ref2.path;
  var path = _ref2$path === undefined ? '/engine.io' : _ref2$path;
  var host = _ref2.host;
  var port = _ref2.port;
  var _ref2$proto = _ref2.proto;
  var proto = _ref2$proto === undefined ? 'http' : _ref2$proto;

  var target = proto + '://' + host + ':' + port;

  app.use((0, _httpProxyMiddleware2.default)(path, {
    target: target,
    ws: true
  }));
}

function setupExpressApi() {}