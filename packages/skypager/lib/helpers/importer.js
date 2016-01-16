'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Importers are special functions which import a URI such as a local
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * path and turn it into a Project, or in some cases an Entity or a
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * collection of Entities.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Importer = (function (_Helper) {
  _inherits(Importer, _Helper);

  function Importer() {
    _classCallCheck(this, Importer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Importer).apply(this, arguments));
  }

  _createClass(Importer, [{
    key: 'helperType',
    get: function get() {
      return 'importer';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Importer;
    }
  }]);

  return Importer;
})(_helper2.default);

exports.default = Importer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2ltcG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVFxQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7O2tFQUFSLFFBQVE7OztlQUFSLFFBQVE7O3dCQUNUO0FBQ2hCLGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7d0JBRWtCO0FBQ2pCLGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7U0FQa0IsUUFBUTs7O2tCQUFSLFFBQVEiLCJmaWxlIjoiaW1wb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogSW1wb3J0ZXJzIGFyZSBzcGVjaWFsIGZ1bmN0aW9ucyB3aGljaCBpbXBvcnQgYSBVUkkgc3VjaCBhcyBhIGxvY2FsXG4qIHBhdGggYW5kIHR1cm4gaXQgaW50byBhIFByb2plY3QsIG9yIGluIHNvbWUgY2FzZXMgYW4gRW50aXR5IG9yIGFcbiogY29sbGVjdGlvbiBvZiBFbnRpdGllcy5cbiovXG5cbmltcG9ydCBIZWxwZXIgZnJvbSAnLi9oZWxwZXInXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltcG9ydGVyIGV4dGVuZHMgSGVscGVyIHtcbiAgZ2V0IGhlbHBlclR5cGUgKCkge1xuICAgIHJldHVybiAnaW1wb3J0ZXInXG4gIH1cblxuICBnZXQgaGVscGVyQ2xhc3MgKCkge1xuICAgIHJldHVybiBJbXBvcnRlclxuICB9XG59XG4iXX0=