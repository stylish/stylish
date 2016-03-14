'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LockedWebApp = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

exports.getProfile = getProfile;
exports.doLogin = doLogin;

var _WebApp2 = require('ui/shells/WebApp');

var _WebApp3 = _interopRequireDefault(_WebApp2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lock = undefined;

var LockedWebApp = exports.LockedWebApp = (function (_WebApp) {
  (0, _inherits3.default)(LockedWebApp, _WebApp);

  function LockedWebApp() {
    (0, _classCallCheck3.default)(this, LockedWebApp);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(LockedWebApp).apply(this, arguments));
  }

  (0, _createClass3.default)(LockedWebApp, null, [{
    key: 'create',
    value: function create() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      options.defer = true;
      var render = Application.create(options);

      if (!lock && options.lock) {
        lock = new Auth0Lock(options.lock.clientId, options.lock.domain || options.lock.clientDomain);
      }

      doLogin().then(cacheToken).then(render);
    }
  }]);
  return LockedWebApp;
})(_WebApp3.default);

function cacheToken(result) {
  localStorage.setItem('userToken', result.user_id);
  localStorage.setItem('userProfile', (0, _stringify2.default)(result));

  return result.user_id;
}

function getProfile(token) {
  token = token || localStorage.getItem('userToken');

  return new _promise2.default(function (resolve, reject) {
    lock.getProfile(token, function (err, result) {
      return err ? reject(err) : resolve(result);
    });
  });
}

function doLogin() {
  return new _promise2.default(function (resolve, reject) {
    if (!lock) {
      console.error('could not get lock. did you configure auth0?');
      reject('could not get access to auth0 lock; did you configure it?');
      return;
    }

    lock.show(function (err, result) {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

exports.default = LockedWebApp;