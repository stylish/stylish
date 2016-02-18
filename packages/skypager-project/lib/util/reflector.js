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
  host.should.be.an.Object();
  host.should.have.property('type');
  idPaths.should.be.a.Function();
  startProp.should.be.a.String();

  var Interface = function Interface() {
    (0, _classCallCheck3.default)(this, Interface);
  };
}