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

var framework = new Skypager(__dirname);

module.exports = framework;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJO0FBQ0YsU0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7Q0FDMUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUVYOztJQVNLLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7a0VBQVIsUUFBUTs7O2VBQVIsUUFBUTs7d0JBQ0c7QUFBRSwrQkFBYztLQUFFOzs7d0JBQ25CO0FBQUUsOEJBQWE7S0FBRTs7O3dCQUNoQjtBQUFFLCtCQUFjO0tBQUU7Ozt3QkFDbkI7QUFBRSxhQUFPLGtCQUFRLE1BQU0sQ0FBQTtLQUFFOzs7d0JBRTNCO0FBQ1YsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBUkcsUUFBUTs7O0FBV2QsSUFBSSxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRXZDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsidHJ5IHtcbiAgcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxufSBjYXRjaCAoZSkge1xuXG59XG5cbmltcG9ydCBGcmFtZXdvcmsgZnJvbSAnLi9mcmFtZXdvcmsnXG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL3Byb2plY3QnXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcbmltcG9ydCBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbmNsYXNzIFNreXBhZ2VyIGV4dGVuZHMgRnJhbWV3b3JrIHtcbiAgZ2V0IFByb2plY3QgKCkgeyByZXR1cm4gUHJvamVjdCB9XG4gIGdldCBBc3NldHMgKCkgeyByZXR1cm4gQXNzZXRzIH1cbiAgZ2V0IEhlbHBlcnMgKCkgeyByZXR1cm4gSGVscGVycyB9XG4gIGdldCBQbHVnaW4gKCkgeyByZXR1cm4gSGVscGVycy5QbHVnaW4gfVxuXG4gIGdldCB1dGlsICgpIHtcbiAgICByZXR1cm4gdXRpbFxuICB9XG59XG5cbmxldCBmcmFtZXdvcmsgPSBuZXcgU2t5cGFnZXIoX19kaXJuYW1lKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZyYW1ld29ya1xuIl19