'use strict';

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = ['jpg', 'gif', 'svg', 'png'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var Image = (function (_Asset) {
  _inherits(Image, _Asset);

  function Image() {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Image).apply(this, arguments));
  }

  return Image;
})(_asset2.default);

Image.EXTENSIONS = EXTENSIONS;
Image.GLOB = GLOB;

exports = module.exports = Image;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvaW1hZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQy9DLElBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTs7SUFFNUMsS0FBSztZQUFMLEtBQUs7O1dBQUwsS0FBSzswQkFBTCxLQUFLOztrRUFBTCxLQUFLOzs7U0FBTCxLQUFLOzs7QUFJWCxLQUFLLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtBQUM3QixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTs7QUFFakIsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6ImltYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ2pwZycsICdnaWYnLCAnc3ZnJywgJ3BuZyddXG5jb25zdCBHTE9CID0gJyoqLyoueycgKyBFWFRFTlNJT05TLmpvaW4oJywnKSArICd9J1xuXG5jbGFzcyBJbWFnZSBleHRlbmRzIEFzc2V0IHtcblxufVxuXG5JbWFnZS5FWFRFTlNJT05TID0gRVhURU5TSU9OU1xuSW1hZ2UuR0xPQiA9IEdMT0JcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSW1hZ2VcbiJdfQ==