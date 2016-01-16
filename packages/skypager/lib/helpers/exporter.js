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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Exporters are functions which get run on a Project or Entity and can be used to transform that project
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * into some other form, for example a static html website, a react application, a zip, or a PDF.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */

var Exporter = (function (_Helper) {
  _inherits(Exporter, _Helper);

  function Exporter() {
    _classCallCheck(this, Exporter);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Exporter).apply(this, arguments));
  }

  _createClass(Exporter, [{
    key: 'helperType',
    get: function get() {
      return 'exporter';
    }
  }, {
    key: 'helperClass',
    get: function get() {
      return Exporter;
    }
  }]);

  return Exporter;
})(_helper2.default);

exports.default = Exporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2V4cG9ydGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFTcUIsUUFBUTtZQUFSLFFBQVE7O1dBQVIsUUFBUTswQkFBUixRQUFROztrRUFBUixRQUFROzs7ZUFBUixRQUFROzt3QkFDVDtBQUNoQixhQUFPLFVBQVUsQ0FBQTtLQUNsQjs7O3dCQUVrQjtBQUNqQixhQUFPLFFBQVEsQ0FBQTtLQUNoQjs7O1NBUGtCLFFBQVE7OztrQkFBUixRQUFRIiwiZmlsZSI6ImV4cG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qXG4qIEV4cG9ydGVycyBhcmUgZnVuY3Rpb25zIHdoaWNoIGdldCBydW4gb24gYSBQcm9qZWN0IG9yIEVudGl0eSBhbmQgY2FuIGJlIHVzZWQgdG8gdHJhbnNmb3JtIHRoYXQgcHJvamVjdFxuKiBpbnRvIHNvbWUgb3RoZXIgZm9ybSwgZm9yIGV4YW1wbGUgYSBzdGF0aWMgaHRtbCB3ZWJzaXRlLCBhIHJlYWN0IGFwcGxpY2F0aW9uLCBhIHppcCwgb3IgYSBQREYuXG4qXG4qL1xuXG5pbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvcnRlciBleHRlbmRzIEhlbHBlciB7XG4gIGdldCBoZWxwZXJUeXBlICgpIHtcbiAgICByZXR1cm4gJ2V4cG9ydGVyJ1xuICB9XG5cbiAgZ2V0IGhlbHBlckNsYXNzICgpIHtcbiAgICByZXR1cm4gRXhwb3J0ZXJcbiAgfVxufVxuIl19