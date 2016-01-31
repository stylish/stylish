'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataSource).call(this, uri, options));

    _this.lazy('parsed', function () {
      return _this.parse(_this.raw);
    });
    _this.lazy('indexed', function () {
      return _this.index(_this.parsed, _this);
    });
    _this.lazy('transformed', function () {
      return _this.transform(_this.indexed, _this);
    });
    return _this;
  }

  _createClass(DataSource, [{
    key: 'parser',
    value: function parser(content, asset) {
      var _this2 = this;

      content = content || this.raw || '';

      if (this.extension === '.js') {
        return handleScript.call(this, this, function () {
          return require(_this2.paths.absolute);
        });
      } else if (this.extension === '.json') {
        return JSON.parse(content || '{}');
      } else if (this.extension === '.yml') {
        return require('js-yaml').safeLoad(content || '');
      } else if (this.extension === '.csv') {
        return [];
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
      return this.indexed;
    }
  }]);

  return DataSource;
})(_asset2.default);

DataSource.EXTENSIONS = EXTENSIONS;
DataSource.GLOB = GLOB;

exports = module.exports = DataSource;

function handleScript(datasource, load) {
  var locals = {
    util: util,
    datasource: datasource,
    project: datasource.project
  };

  return util.noConflict(function () {
    var exp = load();

    console.log('No Conflict', exp);
    if (typeof exp === 'function') {
      return exp.call(datasource, datasource, datasource.project);
    } else {
      return exp;
    }
  }, locals)();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZGF0YV9zb3VyY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUNZLElBQUk7Ozs7Ozs7Ozs7OztBQUVoQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN2RCxJQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7O0lBRTVDLFVBQVU7WUFBVixVQUFVOztBQUNkLFdBREksVUFBVSxDQUNELEdBQUcsRUFBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQixVQUFVOzt1RUFBVixVQUFVLGFBRU4sR0FBRyxFQUFFLE9BQU87O0FBRWxCLFVBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTthQUFNLE1BQUssS0FBSyxDQUFDLE1BQUssR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQy9DLFVBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTthQUFNLE1BQUssS0FBSyxDQUFDLE1BQUssTUFBTSxRQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQ3pELFVBQUssSUFBSSxDQUFDLGFBQWEsRUFBRTthQUFNLE1BQUssU0FBUyxDQUFDLE1BQUssT0FBTyxRQUFPO0tBQUEsQ0FBQyxDQUFBOztHQUNuRTs7ZUFQRyxVQUFVOzsyQkFhTixPQUFPLEVBQUUsS0FBSyxFQUFFOzs7QUFDdEIsYUFBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQTs7QUFFbkMsVUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRTtBQUM1QixlQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtpQkFBTSxPQUFPLENBQUMsT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQ3pFLE1BQU0sSUFBRyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtBQUNwQyxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFBO09BQ25DLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO09BRWxELE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLEVBQUUsQ0FBQTtPQUNWLE1BQU07O0FBRUwsY0FBTyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQ3hFO0tBQ0Y7Ozs0QkFFUSxNQUFNLEVBQUU7QUFDZixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7Z0NBRVksT0FBTyxFQUFFO0FBQ3BCLGFBQU8sT0FBTyxDQUFBO0tBQ2Y7Ozt3QkE1Qlc7QUFDVixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7OztTQVhHLFVBQVU7OztBQXdDaEIsVUFBVSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7QUFDbEMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7O0FBRXRCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQTs7QUFFckMsU0FBUyxZQUFZLENBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtBQUN2QyxNQUFJLE1BQU0sR0FBRztBQUNYLFFBQUksRUFBSixJQUFJO0FBQ0osY0FBVSxFQUFWLFVBQVU7QUFDVixXQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87R0FDNUIsQ0FBQTs7QUFFRCxTQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBVTtBQUMvQixRQUFJLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQTs7QUFFaEIsV0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDL0IsUUFBSSxPQUFPLEdBQUcsS0FBSyxVQUFVLEVBQUU7QUFDNUIsYUFBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzdELE1BQU07QUFDTCxhQUFPLEdBQUcsQ0FBQTtLQUNYO0dBQ0YsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFBO0NBQ2IiLCJmaWxlIjoiZGF0YV9zb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgRVhURU5TSU9OUyA9IFsnanMnLCAnanNvbicsICd5YW1sJywgJ3ltbCcsICdjc3YnXVxuY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuY2xhc3MgRGF0YVNvdXJjZSBleHRlbmRzIEFzc2V0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIodXJpLCBvcHRpb25zKVxuXG4gICAgdGhpcy5sYXp5KCdwYXJzZWQnLCAoKSA9PiB0aGlzLnBhcnNlKHRoaXMucmF3KSlcbiAgICB0aGlzLmxhenkoJ2luZGV4ZWQnLCAoKSA9PiB0aGlzLmluZGV4KHRoaXMucGFyc2VkLCB0aGlzKSlcbiAgICB0aGlzLmxhenkoJ3RyYW5zZm9ybWVkJywgKCkgPT4gdGhpcy50cmFuc2Zvcm0odGhpcy5pbmRleGVkLCB0aGlzKSlcbiAgfVxuXG4gIGdldCBkYXRhICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleGVkXG4gIH1cblxuICBwYXJzZXIgKGNvbnRlbnQsIGFzc2V0KSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQgfHwgdGhpcy5yYXcgfHwgJydcblxuICAgIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy5qcycpIHtcbiAgICAgIHJldHVybiBoYW5kbGVTY3JpcHQuY2FsbCh0aGlzLCB0aGlzLCAoKSA9PiByZXF1aXJlKHRoaXMucGF0aHMuYWJzb2x1dGUpKVxuICAgIH0gZWxzZSBpZih0aGlzLmV4dGVuc2lvbiA9PT0gJy5qc29uJykge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudCB8fCAne30nKVxuICAgIH0gZWxzZSBpZiAodGhpcy5leHRlbnNpb24gPT09ICcueW1sJykge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJ2pzLXlhbWwnKS5zYWZlTG9hZChjb250ZW50IHx8ICcnKVxuXG4gICAgfSBlbHNlIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy5jc3YnKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aHJvdyAoJ0ltcGxlbWVudCBwYXJzZXIgZm9yICcgKyB0aGlzLmV4dGVuc2lvbiArICcgJyArIGNvbnRlbnQubGVuZ3RoKVxuICAgIH1cbiAgfVxuXG4gIGluZGV4ZXIgKHBhcnNlZCkge1xuICAgIHJldHVybiBwYXJzZWRcbiAgfVxuXG4gIHRyYW5zZm9ybWVyIChpbmRleGVkKSB7XG4gICAgcmV0dXJuIGluZGV4ZWRcbiAgfVxufVxuXG5EYXRhU291cmNlLkVYVEVOU0lPTlMgPSBFWFRFTlNJT05TXG5EYXRhU291cmNlLkdMT0IgPSBHTE9CXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IERhdGFTb3VyY2VcblxuZnVuY3Rpb24gaGFuZGxlU2NyaXB0IChkYXRhc291cmNlLCBsb2FkKSB7XG4gIGxldCBsb2NhbHMgPSB7XG4gICAgdXRpbCxcbiAgICBkYXRhc291cmNlLFxuICAgIHByb2plY3Q6IGRhdGFzb3VyY2UucHJvamVjdFxuICB9XG5cbiAgcmV0dXJuIHV0aWwubm9Db25mbGljdChmdW5jdGlvbigpe1xuICAgIGxldCBleHAgPSBsb2FkKClcblxuICAgIGNvbnNvbGUubG9nKCdObyBDb25mbGljdCcsIGV4cClcbiAgICBpZiAodHlwZW9mIGV4cCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgIHJldHVybiBleHAuY2FsbChkYXRhc291cmNlLCBkYXRhc291cmNlLCBkYXRhc291cmNlLnByb2plY3QpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBleHBcbiAgICB9XG4gIH0sIGxvY2FscykoKVxufVxuIl19