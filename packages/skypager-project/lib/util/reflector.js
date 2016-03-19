'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* Build a more dynamic dot path interface for a registry or collection
* that is capable of rebuilding itself when one of the members
* changes, and only lazy loads the paths that are traversed
*/

function reflector(host, startProp, getIdPaths) {
  invariant(host, 'provide a host');
  invariant(host.type, 'host needs a type');
  invariant(idPaths, 'idPaths should be a function');
  invariant(startProp, 'provide startProp');

  var Interface = function Interface() {
    (0, _classCallCheck3.default)(this, Interface);
  };
}