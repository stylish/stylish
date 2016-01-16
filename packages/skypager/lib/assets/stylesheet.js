'use strict';

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = ['css', 'less', 'scss', 'sass'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

/**
* Ideas:
*
* Parse a stylesheet to learn about the rules it exposes
*/

var Stylesheet = (function (_Asset) {
  _inherits(Stylesheet, _Asset);

  function Stylesheet() {
    _classCallCheck(this, Stylesheet);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Stylesheet).apply(this, arguments));
  }

  return Stylesheet;
})(_asset2.default);

exports = module.exports = Stylesheet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvc3R5bGVzaGVldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7QUFDbEQsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRzs7Ozs7OztBQUFBO0lBTzVDLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7MEJBQVYsVUFBVTs7a0VBQVYsVUFBVTs7O1NBQVYsVUFBVTs7O0FBSWhCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQSIsImZpbGUiOiJzdHlsZXNoZWV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ2NzcycsICdsZXNzJywgJ3Njc3MnLCAnc2FzcyddXG5jb25zdCBHTE9CID0gJyoqLyoueycgKyBFWFRFTlNJT05TLmpvaW4oJywnKSArICd9J1xuXG4vKipcbiogSWRlYXM6XG4qXG4qIFBhcnNlIGEgc3R5bGVzaGVldCB0byBsZWFybiBhYm91dCB0aGUgcnVsZXMgaXQgZXhwb3Nlc1xuKi9cbmNsYXNzIFN0eWxlc2hlZXQgZXh0ZW5kcyBBc3NldCB7XG5cbn1cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gU3R5bGVzaGVldFxuIl19