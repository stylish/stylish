'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _plugin = require('./definitions/plugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Plugin = (function (_Helper) {
  _inherits(Plugin, _Helper);

  function Plugin() {
    _classCallCheck(this, Plugin);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Plugin).apply(this, arguments));
  }

  _createClass(Plugin, null, [{
    key: 'validate',
    value: function validate(instance) {
      try {
        instance.name.should.be.a.String;
      } catch (error) {
        return error.message;
      }

      return true;
    }
  }, {
    key: 'fromDefinition',
    value: function fromDefinition(uri, actionDef) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.api = actionDef.api;
      return new Plugin(uri, options);
    }
  }]);

  return Plugin;
})(_helper2.default);

Plugin.DSL = _plugin.DSL;
Plugin.Definition = _plugin.PluginDefinition;

module.exports = Plugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFHTSxNQUFNO1lBQU4sTUFBTTs7V0FBTixNQUFNOzBCQUFOLE1BQU07O2tFQUFOLE1BQU07OztlQUFOLE1BQU07OzZCQUNPLFFBQVEsRUFBRTtBQUN6QixVQUFJO0FBQ0MsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO09BQ3BDLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxlQUFPLEtBQUssQ0FBQyxPQUFPLENBQUE7T0FDckI7O0FBRUQsYUFBTyxJQUFJLENBQUE7S0FDWjs7O21DQUVzQixHQUFHLEVBQUUsU0FBUyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDakQsYUFBTyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFBO0FBQzNCLGFBQU8sSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQ2hDOzs7U0FkRyxNQUFNOzs7QUFpQlosTUFBTSxDQUFDLEdBQUcsV0FuQkQsR0FBRyxBQW1CSSxDQUFBO0FBQ2hCLE1BQU0sQ0FBQyxVQUFVLFdBcEJILGdCQUFnQixBQW9CTSxDQUFBOztBQUVwQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJwbHVnaW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IHsgRFNMLCBQbHVnaW5EZWZpbml0aW9uIH0gZnJvbSAnLi9kZWZpbml0aW9ucy9wbHVnaW4nXG5cbmNsYXNzIFBsdWdpbiBleHRlbmRzIEhlbHBlciB7XG4gIHN0YXRpYyB2YWxpZGF0ZSAoaW5zdGFuY2UpIHtcbiAgICB0cnkge1xuXHRcdFx0ICAgICAgaW5zdGFuY2UubmFtZS5zaG91bGQuYmUuYS5TdHJpbmdcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2VcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgc3RhdGljIGZyb21EZWZpbml0aW9uICh1cmksIGFjdGlvbkRlZiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy5hcGkgPSBhY3Rpb25EZWYuYXBpXG4gICAgcmV0dXJuIG5ldyBQbHVnaW4odXJpLCBvcHRpb25zKVxuICB9XG59XG5cblBsdWdpbi5EU0wgPSBEU0xcblBsdWdpbi5EZWZpbml0aW9uID0gUGx1Z2luRGVmaW5pdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsdWdpblxuIl19