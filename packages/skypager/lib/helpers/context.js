'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _context = require('./definitions/context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Context = (function (_Helper) {
  _inherits(Context, _Helper);

  function Context() {
    _classCallCheck(this, Context);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Context).apply(this, arguments));
  }

  _createClass(Context, [{
    key: 'helperType',
    get: function get() {
      return 'context';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Context;
    }
  }, {
    key: 'definitionClass',
    get: function get() {
      return _context2.default;
    }
  }]);

  return Context;
})(_helper2.default);

exports.default = Context;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2NvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR3FCLE9BQU87WUFBUCxPQUFPOztXQUFQLE9BQU87MEJBQVAsT0FBTzs7a0VBQVAsT0FBTzs7O2VBQVAsT0FBTzs7d0JBQ1I7QUFDaEIsYUFBTyxTQUFTLENBQUE7S0FDakI7Ozt3QkFFa0I7QUFDakIsYUFBTyxPQUFPLENBQUE7S0FDZjs7O3dCQUVzQjtBQUNyQiwrQkFBd0I7S0FDekI7OztTQVhrQixPQUFPOzs7a0JBQVAsT0FBTyIsImZpbGUiOiJjb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhlbHBlciBmcm9tICcuL2hlbHBlcidcbmltcG9ydCBDb250ZXh0RGVmaW5pdGlvbiBmcm9tICcuL2RlZmluaXRpb25zL2NvbnRleHQnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRleHQgZXh0ZW5kcyBIZWxwZXIge1xuICBnZXQgaGVscGVyVHlwZSAoKSB7XG4gICAgcmV0dXJuICdjb250ZXh0J1xuICB9XG5cbiAgZ2V0IGhlbHBlckNsYXNzICgpIHtcbiAgICByZXR1cm4gQ29udGV4dFxuICB9XG5cbiAgZ2V0IGRlZmluaXRpb25DbGFzcyAoKSB7XG4gICAgcmV0dXJuIENvbnRleHREZWZpbml0aW9uXG4gIH1cbn1cbiJdfQ==