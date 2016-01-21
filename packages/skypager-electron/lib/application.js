'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Application = undefined;

var _electronifyServer = require('electronify-server');

var _electronifyServer2 = _interopRequireDefault(_electronifyServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_HOST = 'localhost';
var DEFAULT_PORT = 3000;

var Application = exports.Application = (function () {
  _createClass(Application, null, [{
    key: 'boot',
    value: function boot() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var app = new Application(options);

      app.startProcess('main');

      return app;
    }
  }]);

  function Application() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Application);

    this.windows = {};
    this.processes = {};
  }

  _createClass(Application, [{
    key: 'startProcess',
    value: function startProcess() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? this.nextWindowName : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      (0, _electronifyServer2.default)({
        url: 'http://' + (host || DEFAULT_HOST) + ':' + (port || DEFAULT_PORT),
        window: {
          height: options.height || 960,
          width: options.width || 1440
        },
        ready: function ready(app) {
          options.ready && options.ready(app);
        },
        preLoad: function preLoad(app, win) {
          options.preLoad && options.preLoad(app, win);
        },
        postLoad: function postLoad(app, win) {
          options.postLoad && options.postLoad(app, win);
        }
      });
    }
  }, {
    key: 'nextWindowName',
    get: function get() {
      return 'window-' + Object.keys(this.windows).length;
    }
  }]);

  return Application;
})();

exports.default = Application;