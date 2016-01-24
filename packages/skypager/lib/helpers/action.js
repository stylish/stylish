'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _registry = require('../registry');

var _registry2 = _interopRequireDefault(_registry);

var _action = require('./definitions/action');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Action = (function (_Helper) {
  _inherits(Action, _Helper);

  function Action() {
    _classCallCheck(this, Action);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Action).apply(this, arguments));
  }

  _createClass(Action, [{
    key: 'definitionClass',
    get: function get() {
      return _action.ActionDefinition;
    }
  }], [{
    key: 'validate',
    value: function validate(instance) {
      try {
        instance.name.should.be.a.String;
        instance.aliases.should.be.a.Array;
        instance.validate.should.be.a.Function;
        instance.parameters.should.be.a.Object;
      } catch (error) {
        return error.message;
      }

      return true;
    }
  }]);

  return Action;
})(_helper2.default);

Action.DSL = _action.DSL;
Action.Definition = _action.ActionDefinition;
Action.apiMethods = _action.ActionDefinition.apiMethods;

module.exports = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSU0sTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOztrRUFBTixNQUFNOzs7ZUFBTixNQUFNOzt3QkFjYTtBQUNwQixxQkFqQlMsZ0JBQWdCLENBaUJGO0tBQ3pCOzs7NkJBZmdCLFFBQVEsRUFBRTtBQUN6QixVQUFJO0FBQ0YsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO0FBQ2hDLGdCQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQTtBQUNsQyxnQkFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUE7QUFDdEMsZ0JBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFBO09BQ3ZDLENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxlQUFPLEtBQUssQ0FBQyxPQUFPLENBQUE7T0FDckI7O0FBRUQsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBWkcsTUFBTTs7O0FBbUJaLE1BQU0sQ0FBQyxHQUFHLFdBckJELEdBQUcsQUFxQkksQ0FBQTtBQUNoQixNQUFNLENBQUMsVUFBVSxXQXRCSCxnQkFBZ0IsQUFzQk0sQ0FBQTtBQUNwQyxNQUFNLENBQUMsVUFBVSxHQUFHLFFBdkJOLGdCQUFnQixDQXVCTyxVQUFVLENBQUE7O0FBRS9DLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFBIiwiZmlsZSI6ImFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBIZWxwZXIgZnJvbSAnLi9oZWxwZXInXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnknXG5pbXBvcnQgeyBEU0wsIEFjdGlvbkRlZmluaXRpb24gfSBmcm9tICcuL2RlZmluaXRpb25zL2FjdGlvbidcblxuY2xhc3MgQWN0aW9uIGV4dGVuZHMgSGVscGVyIHtcbiAgc3RhdGljIHZhbGlkYXRlIChpbnN0YW5jZSkge1xuICAgIHRyeSB7XG4gICAgICBpbnN0YW5jZS5uYW1lLnNob3VsZC5iZS5hLlN0cmluZ1xuICAgICAgaW5zdGFuY2UuYWxpYXNlcy5zaG91bGQuYmUuYS5BcnJheVxuICAgICAgaW5zdGFuY2UudmFsaWRhdGUuc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgICAgIGluc3RhbmNlLnBhcmFtZXRlcnMuc2hvdWxkLmJlLmEuT2JqZWN0XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBlcnJvci5tZXNzYWdlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIGdldCBkZWZpbml0aW9uQ2xhc3MgKCkge1xuICAgICByZXR1cm4gQWN0aW9uRGVmaW5pdGlvblxuICB9XG59XG5cbkFjdGlvbi5EU0wgPSBEU0xcbkFjdGlvbi5EZWZpbml0aW9uID0gQWN0aW9uRGVmaW5pdGlvblxuQWN0aW9uLmFwaU1ldGhvZHMgPSBBY3Rpb25EZWZpbml0aW9uLmFwaU1ldGhvZHNcblxubW9kdWxlLmV4cG9ydHMgPSBBY3Rpb25cbiJdfQ==