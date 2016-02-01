'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stylesheet = exports.GLOB = exports.EXTENSIONS = undefined;

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = exports.EXTENSIONS = ['css', 'less', 'scss', 'sass'];
var GLOB = exports.GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

/**
* Ideas:
*
* Parse a stylesheet to learn about the rules it exposes
*/

var Stylesheet = exports.Stylesheet = (function (_Asset) {
  _inherits(Stylesheet, _Asset);

  function Stylesheet() {
    _classCallCheck(this, Stylesheet);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Stylesheet).apply(this, arguments));
  }

  _createClass(Stylesheet, [{
    key: 'imports',
    get: function get() {
      return ['TODO: list which dependencies it imports'];
    }
  }, {
    key: 'usesVariables',
    get: function get() {
      return ['TODO: list which variables it uses'];
    }
  }, {
    key: 'variables',
    get: function get() {
      return ['TODO: list which variables it defines'];
    }
  }]);

  return Stylesheet;
})(_asset2.default);

exports.default = Stylesheet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvc3R5bGVzaGVldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFTyxJQUFNLFVBQVUsV0FBVixVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUNsRCxJQUFNLElBQUksV0FBSixJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRzs7Ozs7OztBQUFBO0lBTzVDLFVBQVUsV0FBVixVQUFVO1lBQVYsVUFBVTs7V0FBVixVQUFVOzBCQUFWLFVBQVU7O2tFQUFWLFVBQVU7OztlQUFWLFVBQVU7O3dCQUNQO0FBQ1osYUFBTyxDQUFDLDBDQUEwQyxDQUFDLENBQUE7S0FDcEQ7Ozt3QkFFbUI7QUFDbEIsYUFBTyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7S0FDOUM7Ozt3QkFFZTtBQUNiLGFBQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO0tBQ2xEOzs7U0FYVSxVQUFVOzs7a0JBY1IsVUFBVSIsImZpbGUiOiJzdHlsZXNoZWV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5cbmV4cG9ydCBjb25zdCBFWFRFTlNJT05TID0gWydjc3MnLCAnbGVzcycsICdzY3NzJywgJ3Nhc3MnXVxuZXhwb3J0IGNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbi8qKlxuKiBJZGVhczpcbipcbiogUGFyc2UgYSBzdHlsZXNoZWV0IHRvIGxlYXJuIGFib3V0IHRoZSBydWxlcyBpdCBleHBvc2VzXG4qL1xuZXhwb3J0IGNsYXNzIFN0eWxlc2hlZXQgZXh0ZW5kcyBBc3NldCB7XG4gIGdldCBpbXBvcnRzKCkge1xuICAgIHJldHVybiBbJ1RPRE86IGxpc3Qgd2hpY2ggZGVwZW5kZW5jaWVzIGl0IGltcG9ydHMnXVxuICB9XG5cbiAgZ2V0IHVzZXNWYXJpYWJsZXMoKSB7XG4gICAgcmV0dXJuIFsnVE9ETzogbGlzdCB3aGljaCB2YXJpYWJsZXMgaXQgdXNlcyddXG4gIH1cblxuICBnZXQgdmFyaWFibGVzKCkge1xuICAgICByZXR1cm4gWydUT0RPOiBsaXN0IHdoaWNoIHZhcmlhYmxlcyBpdCBkZWZpbmVzJ11cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdHlsZXNoZWV0XG4iXX0=