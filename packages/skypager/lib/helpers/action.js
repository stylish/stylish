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
  }, {
    key: 'fromDefinition',
    value: function fromDefinition(uri, actionDef) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.api = actionDef.api;
      return new Action(uri, options);
    }
  }]);

  return Action;
})(_helper2.default);

Action.DSL = _action.DSL;
Action.Definition = _action.ActionDefinition;
Action.apiMethods = _action.ActionDefinition.apiMethods;

module.exports = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSU0sTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOztrRUFBTixNQUFNOzs7ZUFBTixNQUFNOzt3QkFtQmE7QUFDcEIscUJBdEJTLGdCQUFnQixDQXNCRjtLQUN6Qjs7OzZCQXBCZ0IsUUFBUSxFQUFFO0FBQ3pCLFVBQUk7QUFDRixnQkFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7QUFDaEMsZ0JBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBO0FBQ2xDLGdCQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQTtBQUN0QyxnQkFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7T0FDdkMsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGVBQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQTtPQUNyQjs7QUFFRCxhQUFPLElBQUksQ0FBQTtLQUNaOzs7bUNBRXNCLEdBQUcsRUFBRSxTQUFTLEVBQWdCO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNqRCxhQUFPLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUE7QUFDM0IsYUFBTyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDaEM7OztTQWpCRyxNQUFNOzs7QUF3QlosTUFBTSxDQUFDLEdBQUcsV0ExQkQsR0FBRyxBQTBCSSxDQUFBO0FBQ2hCLE1BQU0sQ0FBQyxVQUFVLFdBM0JILGdCQUFnQixBQTJCTSxDQUFBO0FBQ3BDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsUUE1Qk4sZ0JBQWdCLENBNEJPLFVBQVUsQ0FBQTs7QUFFL0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUEiLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEhlbHBlciBmcm9tICcuL2hlbHBlcidcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuLi9yZWdpc3RyeSdcbmltcG9ydCB7IERTTCwgQWN0aW9uRGVmaW5pdGlvbiB9IGZyb20gJy4vZGVmaW5pdGlvbnMvYWN0aW9uJ1xuXG5jbGFzcyBBY3Rpb24gZXh0ZW5kcyBIZWxwZXIge1xuICBzdGF0aWMgdmFsaWRhdGUgKGluc3RhbmNlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGluc3RhbmNlLm5hbWUuc2hvdWxkLmJlLmEuU3RyaW5nXG4gICAgICBpbnN0YW5jZS5hbGlhc2VzLnNob3VsZC5iZS5hLkFycmF5XG4gICAgICBpbnN0YW5jZS52YWxpZGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvblxuICAgICAgaW5zdGFuY2UucGFyYW1ldGVycy5zaG91bGQuYmUuYS5PYmplY3RcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2VcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgc3RhdGljIGZyb21EZWZpbml0aW9uICh1cmksIGFjdGlvbkRlZiwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy5hcGkgPSBhY3Rpb25EZWYuYXBpXG4gICAgcmV0dXJuIG5ldyBBY3Rpb24odXJpLCBvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGRlZmluaXRpb25DbGFzcyAoKSB7XG4gICAgIHJldHVybiBBY3Rpb25EZWZpbml0aW9uXG4gIH1cbn1cblxuQWN0aW9uLkRTTCA9IERTTFxuQWN0aW9uLkRlZmluaXRpb24gPSBBY3Rpb25EZWZpbml0aW9uXG5BY3Rpb24uYXBpTWV0aG9kcyA9IEFjdGlvbkRlZmluaXRpb24uYXBpTWV0aG9kc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvblxuIl19