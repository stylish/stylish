'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _babelCore = require('babel-core');

var _babelCore2 = _interopRequireDefault(_babelCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = ['js', 'jsx', 'cjsx', 'coffee', 'es6'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

// can parse, index, transform js with babel

var Script = (function (_Asset) {
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

Script.EXTENSIONS = EXTENSIONS;
Script.GLOB = GLOB;

exports = module.exports = Script;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvc2NyaXB0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsSUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDekQsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRzs7O0FBQUE7SUFHNUMsTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOztrRUFBTixNQUFNOzs7ZUFBTixNQUFNOzs0QkFDRDtBQUNQLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQTs7QUFFbEUsVUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGVBQU8sR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBQyxDQUFDLHdCQUF3QixFQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQTtPQUM3Rjs7QUFFRCxVQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDWixlQUFPLEFBQUMsdUJBQVMsb0JBQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQTtPQUNqRSxNQUFNO0FBQ0wsZUFBTyxBQUFDLHVCQUFTLG9CQUFNLGlCQUFpQixDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLElBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQTtPQUN6RTtLQUNGOzs7U0FiRyxNQUFNOzs7QUFnQlosTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDOUIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7O0FBRWxCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcbmltcG9ydCBiYWJlbCBmcm9tICdiYWJlbC1jb3JlJ1xuXG5jb25zdCBFWFRFTlNJT05TID0gWydqcycsICdqc3gnLCAnY2pzeCcsICdjb2ZmZWUnLCAnZXM2J11cbmNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbi8vIGNhbiBwYXJzZSwgaW5kZXgsIHRyYW5zZm9ybSBqcyB3aXRoIGJhYmVsXG5jbGFzcyBTY3JpcHQgZXh0ZW5kcyBBc3NldCB7XG4gIHBhcnNlICgpIHtcbiAgICBsZXQgb3B0aW9ucyA9IHRoaXMucHJvamVjdC5tYW5pZmVzdCAmJiB0aGlzLnByb2plY3QubWFuaWZlc3QuYmFiZWxcblxuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHsgcHJlc2V0czpbJ2VzMjAxNSddLCBwbHVnaW5zOlsnc3ludGF4LWFzeW5jLWZ1bmN0aW9ucycsJ3RyYW5zZm9ybS1yZWdlbmVyYXRvciddIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yYXcpIHtcbiAgICAgIHJldHVybiAoYmFiZWwgJiYgYmFiZWwudHJhbnNmb3JtKHRoaXMucmF3LCBvcHRpb25zKSkgfHwgdGhpcy5yYXdcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChiYWJlbCAmJiBiYWJlbC50cmFuc2Zvcm1GaWxlU3luYyh0aGlzLnJhdywgb3B0aW9ucykpIHx8IHRoaXMucmF3XG4gICAgfVxuICB9XG59XG5cblNjcmlwdC5FWFRFTlNJT05TID0gRVhURU5TSU9OU1xuU2NyaXB0LkdMT0IgPSBHTE9CXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IFNjcmlwdFxuIl19