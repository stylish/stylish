'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var DataSource = (function (_Asset) {
  _inherits(DataSource, _Asset);

  function DataSource(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, DataSource);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DataSource).call(this, uri, options));
  }

  _createClass(DataSource, [{
    key: 'parser',
    value: function parser(content, asset) {
      content = content || this.raw || '';

      if (this.requireable) {
        return require(this.paths.absolute);
      } else if (this.extension === '.yml') {
        return require('js-yaml').safeLoad(content || '');
      } else if (this.extension === '.csv') {
        console.log('CSV parsing not yet implemented');
      } else {
        throw 'Implement parser for ' + this.extension + ' ' + content.length;
      }
    }
  }, {
    key: 'indexer',
    value: function indexer(parsed) {
      return parsed;
    }
  }, {
    key: 'transformer',
    value: function transformer(indexed) {
      return indexed;
    }
  }, {
    key: 'data',
    get: function get() {
      return this.transformed;
    }
  }]);

  return DataSource;
})(_asset2.default);

DataSource.EXTENSIONS = EXTENSIONS;
DataSource.GLOB = GLOB;

exports = module.exports = DataSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZGF0YV9zb3VyY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQ3ZELElBQU0sSUFBSSxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQTs7SUFFNUMsVUFBVTtZQUFWLFVBQVU7O0FBQ2QsV0FESSxVQUFVLENBQ0QsR0FBRyxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBRDFCLFVBQVU7O2tFQUFWLFVBQVUsYUFFTixHQUFHLEVBQUUsT0FBTztHQUNuQjs7ZUFIRyxVQUFVOzsyQkFTTixPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3RCLGFBQU8sR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUE7O0FBRW5DLFVBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNwQixlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFBO09BRXBDLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO09BQ2xELE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxDQUFDLENBQUE7T0FDL0MsTUFBTTtBQUNMLGNBQU8sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxHQUFHLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztPQUN4RTtLQUNGOzs7NEJBRVEsTUFBTSxFQUFFO0FBQ2YsYUFBTyxNQUFNLENBQUE7S0FDZDs7O2dDQUVZLE9BQU8sRUFBRTtBQUNwQixhQUFPLE9BQU8sQ0FBQTtLQUNmOzs7d0JBekJXO0FBQ1YsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFBO0tBQ3hCOzs7U0FQRyxVQUFVOzs7QUFpQ2hCLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQ2xDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBOztBQUV0QixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUEiLCJmaWxlIjoiZGF0YV9zb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcblxuY29uc3QgRVhURU5TSU9OUyA9IFsnanMnLCAnanNvbicsICd5YW1sJywgJ3ltbCcsICdjc3YnXVxuY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuY2xhc3MgRGF0YVNvdXJjZSBleHRlbmRzIEFzc2V0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIodXJpLCBvcHRpb25zKVxuICB9XG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVkXG4gIH1cblxuICBwYXJzZXIgKGNvbnRlbnQsIGFzc2V0KSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQgfHwgdGhpcy5yYXcgfHwgJydcblxuICAgIGlmICh0aGlzLnJlcXVpcmVhYmxlKSB7XG4gICAgICByZXR1cm4gcmVxdWlyZSh0aGlzLnBhdGhzLmFic29sdXRlKVxuXG4gICAgfSBlbHNlIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy55bWwnKSB7XG4gICAgICByZXR1cm4gcmVxdWlyZSgnanMteWFtbCcpLnNhZmVMb2FkKGNvbnRlbnQgfHwgJycpXG4gICAgfSBlbHNlIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy5jc3YnKSB7XG4gICAgICBjb25zb2xlLmxvZygnQ1NWIHBhcnNpbmcgbm90IHlldCBpbXBsZW1lbnRlZCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93ICgnSW1wbGVtZW50IHBhcnNlciBmb3IgJyArIHRoaXMuZXh0ZW5zaW9uICsgJyAnICsgY29udGVudC5sZW5ndGgpXG4gICAgfVxuICB9XG5cbiAgaW5kZXhlciAocGFyc2VkKSB7XG4gICAgcmV0dXJuIHBhcnNlZFxuICB9XG5cbiAgdHJhbnNmb3JtZXIgKGluZGV4ZWQpIHtcbiAgICByZXR1cm4gaW5kZXhlZFxuICB9XG59XG5cbkRhdGFTb3VyY2UuRVhURU5TSU9OUyA9IEVYVEVOU0lPTlNcbkRhdGFTb3VyY2UuR0xPQiA9IEdMT0JcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRGF0YVNvdXJjZVxuIl19