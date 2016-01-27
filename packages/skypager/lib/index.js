'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _framework = require('./framework');

var _framework2 = _interopRequireDefault(_framework);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _assets = require('./assets');

var _assets2 = _interopRequireDefault(_assets);

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

try {
  require('babel-polyfill');
} catch (e) {}

var Skypager = (function (_Framework) {
  _inherits(Skypager, _Framework);

  function Skypager() {
    _classCallCheck(this, Skypager);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Skypager).apply(this, arguments));
  }

  _createClass(Skypager, [{
    key: 'Project',
    get: function get() {
      return _project2.default;
    }
  }, {
    key: 'Assets',
    get: function get() {
      return _assets2.default;
    }
  }, {
    key: 'Helpers',
    get: function get() {
      return _helpers2.default;
    }
  }, {
    key: 'Plugin',
    get: function get() {
      return _helpers2.default.Plugin;
    }
  }, {
    key: 'util',
    get: function get() {
      return util;
    }
  }]);

  return Skypager;
})(_framework2.default);

// this tries to ensure that only one instance of skypager lj

var framework = new Skypager(__dirname);

module.exports = framework;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJO0FBQ0YsU0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Q0FDMUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUVYOztJQVNLLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7a0VBQVIsUUFBUTs7O2VBQVIsUUFBUTs7d0JBQ0c7QUFBRSwrQkFBYztLQUFFOzs7d0JBQ25CO0FBQUUsOEJBQWE7S0FBRTs7O3dCQUNoQjtBQUFFLCtCQUFjO0tBQUU7Ozt3QkFDbkI7QUFBRSxhQUFPLGtCQUFRLE1BQU0sQ0FBQTtLQUFFOzs7d0JBRTNCO0FBQ1YsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBUkcsUUFBUTs7Ozs7QUFZZCxJQUFJLFNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFdkMsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJ0cnkge1xuICByZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG59IGNhdGNoIChlKSB7XG5cbn1cblxuaW1wb3J0IEZyYW1ld29yayBmcm9tICcuL2ZyYW1ld29yaydcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuY2xhc3MgU2t5cGFnZXIgZXh0ZW5kcyBGcmFtZXdvcmsge1xuICBnZXQgUHJvamVjdCAoKSB7IHJldHVybiBQcm9qZWN0IH1cbiAgZ2V0IEFzc2V0cyAoKSB7IHJldHVybiBBc3NldHMgfVxuICBnZXQgSGVscGVycyAoKSB7IHJldHVybiBIZWxwZXJzIH1cbiAgZ2V0IFBsdWdpbiAoKSB7IHJldHVybiBIZWxwZXJzLlBsdWdpbiB9XG5cbiAgZ2V0IHV0aWwgKCkge1xuICAgIHJldHVybiB1dGlsXG4gIH1cbn1cblxuLy8gdGhpcyB0cmllcyB0byBlbnN1cmUgdGhhdCBvbmx5IG9uZSBpbnN0YW5jZSBvZiBza3lwYWdlciBsalxubGV0IGZyYW1ld29yayA9IG5ldyBTa3lwYWdlcihfX2Rpcm5hbWUpXG5cbm1vZHVsZS5leHBvcnRzID0gZnJhbWV3b3JrXG4iXX0=