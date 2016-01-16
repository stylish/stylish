'use strict';

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, Interface);
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3JlZmxlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBU0EsU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUU7QUFDL0MsTUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBQzFCLE1BQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQyxTQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDOUIsV0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBOztBQUU5QixNQUFJLFNBQVMsWUFBVCxTQUFTOzBCQUFULFNBQVM7R0FFWixDQUFBO0NBQ0YiLCJmaWxlIjoicmVmbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFzc2lnbiBmcm9tICdvYmplY3QtYXNzaWduJ1xuXG5cbi8qXG4qIEJ1aWxkIGEgbW9yZSBkeW5hbWljIGRvdCBwYXRoIGludGVyZmFjZSBmb3IgYSByZWdpc3RyeSBvciBjb2xsZWN0aW9uXG4qIHRoYXQgaXMgY2FwYWJsZSBvZiByZWJ1aWxkaW5nIGl0c2VsZiB3aGVuIG9uZSBvZiB0aGUgbWVtYmVyc1xuKiBjaGFuZ2VzLCBhbmQgb25seSBsYXp5IGxvYWRzIHRoZSBwYXRocyB0aGF0IGFyZSB0cmF2ZXJzZWRcbiovXG5cbmZ1bmN0aW9uIHJlZmxlY3RvciAoaG9zdCwgc3RhcnRQcm9wLCBnZXRJZFBhdGhzKSB7XG4gIGhvc3Quc2hvdWxkLmJlLmFuLk9iamVjdCgpXG4gIGhvc3Quc2hvdWxkLmhhdmUucHJvcGVydHkoJ3R5cGUnKVxuICBpZFBhdGhzLnNob3VsZC5iZS5hLkZ1bmN0aW9uKClcbiAgc3RhcnRQcm9wLnNob3VsZC5iZS5hLlN0cmluZygpXG5cbiAgbGV0IEludGVyZmFjZSA9IGNsYXNzIHtcblxuICB9XG59XG4iXX0=