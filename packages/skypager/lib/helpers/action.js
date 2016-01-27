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
    key: 'helperClass',
    get: function get() {
      return Action;
    }
  }, {
    key: 'definitionClass',
    get: function get() {
      return _action.ActionDefinition;
    }
  }]);

  return Action;
})(_helper2.default);

Action.DSL = _action.DSL;
Action.Definition = _action.ActionDefinition;
Action.apiMethods = _action.ActionDefinition.apiMethods;

module.exports = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBSU0sTUFBTTtZQUFOLE1BQU07O1dBQU4sTUFBTTswQkFBTixNQUFNOztrRUFBTixNQUFNOzs7ZUFBTixNQUFNOzt3QkFDUztBQUNqQixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7d0JBRXNCO0FBQ3BCLHFCQVJTLGdCQUFnQixDQVFGO0tBQ3pCOzs7U0FQRyxNQUFNOzs7QUFVWixNQUFNLENBQUMsR0FBRyxXQVpELEdBQUcsQUFZSSxDQUFBO0FBQ2hCLE1BQU0sQ0FBQyxVQUFVLFdBYkgsZ0JBQWdCLEFBYU0sQ0FBQTtBQUNwQyxNQUFNLENBQUMsVUFBVSxHQUFHLFFBZE4sZ0JBQWdCLENBY08sVUFBVSxDQUFBOztBQUUvQyxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQSIsImZpbGUiOiJhY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4uL3JlZ2lzdHJ5J1xuaW1wb3J0IHsgRFNMLCBBY3Rpb25EZWZpbml0aW9uIH0gZnJvbSAnLi9kZWZpbml0aW9ucy9hY3Rpb24nXG5cbmNsYXNzIEFjdGlvbiBleHRlbmRzIEhlbHBlciB7XG4gIGdldCBoZWxwZXJDbGFzcyAoKSB7XG4gICAgcmV0dXJuIEFjdGlvblxuICB9XG5cbiAgZ2V0IGRlZmluaXRpb25DbGFzcyAoKSB7XG4gICAgIHJldHVybiBBY3Rpb25EZWZpbml0aW9uXG4gIH1cbn1cblxuQWN0aW9uLkRTTCA9IERTTFxuQWN0aW9uLkRlZmluaXRpb24gPSBBY3Rpb25EZWZpbml0aW9uXG5BY3Rpb24uYXBpTWV0aG9kcyA9IEFjdGlvbkRlZmluaXRpb24uYXBpTWV0aG9kc1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjdGlvblxuIl19