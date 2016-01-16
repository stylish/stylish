'use strict';

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// can parse / index / transform with xml

var Vector = (function (_Asset) {
  _inherits(Vector, _Asset);

  function Vector() {
    _classCallCheck(this, Vector);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Vector).apply(this, arguments));
  }

  return Vector;
})(_asset2.default);

Vector.EXTENSIONS = ['svg'];
Vector.GLOB = '**/*.svg';

exports = module.exports = Vector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvdmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHTSxNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07O2tFQUFOLE1BQU07OztTQUFOLE1BQU07OztBQUlaLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMzQixNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQTs7QUFHeEIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6InZlY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldCBmcm9tICcuL2Fzc2V0J1xuXG4vLyBjYW4gcGFyc2UgLyBpbmRleCAvIHRyYW5zZm9ybSB3aXRoIHhtbFxuY2xhc3MgVmVjdG9yIGV4dGVuZHMgQXNzZXQge1xuXG59XG5cblZlY3Rvci5FWFRFTlNJT05TID0gWydzdmcnXVxuVmVjdG9yLkdMT0IgPSAnKiovKi5zdmcnXG5cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gVmVjdG9yXG4iXX0=