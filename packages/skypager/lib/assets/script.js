'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Script = exports.GLOB = exports.EXTENSIONS = undefined;

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = exports.EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6'];
var GLOB = exports.GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

// can parse, index, transform js with babel

var Script = exports.Script = (function (_Asset) {
  _inherits(Script, _Asset);

  function Script() {
    _classCallCheck(this, Script);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Script).apply(this, arguments));
  }

  _createClass(Script, [{
    key: 'parse',
    value: function parse() {
      var options = this.project.manifest && this.project.manifest.babel;

      if (!options) {
        options = { presets: ['es2015'], plugins: ['syntax-async-functions', 'transform-regenerator'] };
      }

      if (this.raw) {
        return _babelCore2.default && _babelCore2.default.transform(this.raw, options) || this.raw;
      } else {
        return _babelCore2.default && _babelCore2.default.transformFileSync(this.raw, options) || this.raw;
      }
    }
  }]);

  return Script;
})(_asset2.default);

exports.default = Script;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHTyxJQUFNLFVBQVUsV0FBVixVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDekQsSUFBTSxJQUFJLFdBQUosSUFBSSxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUc7OztBQUFBO0lBRzVDLE1BQU0sV0FBTixNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07O2tFQUFOLE1BQU07OztlQUFOLE1BQU07OzRCQUNSO0FBQ1AsVUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFBOztBQUVsRSxVQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osZUFBTyxHQUFHLEVBQUUsT0FBTyxFQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFDLENBQUMsd0JBQXdCLEVBQUMsdUJBQXVCLENBQUMsRUFBRSxDQUFBO09BQzdGOztBQUVELFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNaLGVBQU8sQUFBQyx1QkFBUyxvQkFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSyxJQUFJLENBQUMsR0FBRyxDQUFBO09BQ2pFLE1BQU07QUFDTCxlQUFPLEFBQUMsdUJBQVMsb0JBQU0saUJBQWlCLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsSUFBSyxJQUFJLENBQUMsR0FBRyxDQUFBO09BQ3pFO0tBQ0Y7OztTQWJVLE1BQU07OztrQkFnQkosTUFBTSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcbmltcG9ydCBiYWJlbCBmcm9tICdiYWJlbC1jb3JlJ1xuXG5leHBvcnQgY29uc3QgRVhURU5TSU9OUyA9IFsnanMnLCAnanN4JywgJ2Nqc3gnLCAnY29mZmVlJywgJ2VzNiddXG5leHBvcnQgY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuLy8gY2FuIHBhcnNlLCBpbmRleCwgdHJhbnNmb3JtIGpzIHdpdGggYmFiZWxcbmV4cG9ydCBjbGFzcyBTY3JpcHQgZXh0ZW5kcyBBc3NldCB7XG4gIHBhcnNlICgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMucHJvamVjdC5tYW5pZmVzdCAmJiB0aGlzLnByb2plY3QubWFuaWZlc3QuYmFiZWxcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHsgcHJlc2V0czpbJ2VzMjAxNSddLCBwbHVnaW5zOlsnc3ludGF4LWFzeW5jLWZ1bmN0aW9ucycsJ3RyYW5zZm9ybS1yZWdlbmVyYXRvciddIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYXcpIHtcbiAgICAgIHJldHVybiAoYmFiZWwgJiYgYmFiZWwudHJhbnNmb3JtKHRoaXMucmF3LCBvcHRpb25zKSkgfHwgdGhpcy5yYXdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChiYWJlbCAmJiBiYWJlbC50cmFuc2Zvcm1GaWxlU3luYyh0aGlzLnJhdywgb3B0aW9ucykpIHx8IHRoaXMucmF3XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjcmlwdFxuIl19