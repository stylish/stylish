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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function express(server) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var app = (0, _express3.default)();
  var config = server.config;

  if (config.deepstream) {
    setupDeepstreamProxy(app, config.deepstream, server);
  }

  app.use(express.static(server.paths.public));

  if (config.api) {
    setupExpressAPI(app, config.api, server);
  }

  if (config.webpack) {
    setupWebpackProxy(app, config.webpack, server);
  }

  return app;
}

exports.default = express;

function setupWebpackProxy(app, _ref) {
  var _ref$host = _ref.host;
  var host = _ref$host === undefined ? 'localhost' : _ref$host;
  var _ref$port = _ref.port;
  var port = _ref$port === undefined ? 3000 : _ref$port;
  var _ref$proto = _ref.proto;
  var proto = _ref$proto === undefined ? 'http' : _ref$proto;

  var target = proto + '://' + config.host + ':' + config.port;

  app.use((0, _httpProxyMiddleware2.default)('/', {
    target: target,
    ws: true
  }));
}

function setupDeepstreamProxy(app, _ref2) {
  var host = _ref2.host;
  var port = _ref2.port;
  var _ref2$proto = _ref2.proto;
  var proto = _ref2$proto === undefined ? 'http' : _ref2$proto;

  var root = config.path || '/engine.io';
  var target = proto + '://' + config.host + ':' + config.port;

  app.use(proxyMiddlware(root, {
    target: target,
    ws: true
  }));
}

function setupExpressApi() {}