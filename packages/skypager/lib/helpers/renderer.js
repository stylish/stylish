'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Renderers are functions which turn an entity into something like HTML
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Renderer = (function (_Helper) {
  _inherits(Renderer, _Helper);

  function Renderer() {
    _classCallCheck(this, Renderer);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Renderer).apply(this, arguments));
  }

  _createClass(Renderer, [{
    key: 'helperType',
    get: function get() {
      return 'renderer';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Renderer;
    }
  }]);

  return Renderer;
})(_helper2.default);

exports.default = Renderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3JlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQVFxQixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7O2tFQUFSLFFBQVE7OztlQUFSLFFBQVE7O3dCQUNUO0FBQ2hCLGFBQU8sVUFBVSxDQUFBO0tBQ2xCOzs7d0JBRWtCO0FBQ2pCLGFBQU8sUUFBUSxDQUFBO0tBQ2hCOzs7U0FQa0IsUUFBUTs7O2tCQUFSLFFBQVEiLCJmaWxlIjoicmVuZGVyZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbipcbiogUmVuZGVyZXJzIGFyZSBmdW5jdGlvbnMgd2hpY2ggdHVybiBhbiBlbnRpdHkgaW50byBzb21ldGhpbmcgbGlrZSBIVE1MXG4qXG4qL1xuXG5pbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlciBleHRlbmRzIEhlbHBlciB7XG4gIGdldCBoZWxwZXJUeXBlICgpIHtcbiAgICByZXR1cm4gJ3JlbmRlcmVyJ1xuICB9XG5cbiAgZ2V0IGhlbHBlckNsYXNzICgpIHtcbiAgICByZXR1cm4gUmVuZGVyZXJcbiAgfVxufVxuIl19