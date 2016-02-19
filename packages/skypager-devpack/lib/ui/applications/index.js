'use strict';

var _Application = require('./containers/Application');

var _Application2 = _interopRequireDefault(_Application);

var _LockedApplication = require('./containers/LockedApplication');

var _LockedApplication2 = _interopRequireDefault(_LockedApplication);

var _stateful = require('./util/stateful');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var application = {
  Application: _Application2.default,
  LockedApplication: _LockedApplication2.default,
  stateful: _stateful.stateful,
  util: {
    stateful: _stateful.stateful
  }
};

module.exports = application;