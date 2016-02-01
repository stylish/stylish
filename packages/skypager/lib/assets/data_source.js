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
    _this.lazy('data', _this.getData, true);

    _this.indexer = options.indexer || function (val) {
      return val;
    };
    _this.transformer = options.transformer || function (val) {
      return val;
    };
    return _this;
  }

  _createClass(DataSource, [{
    key: 'getData',
    value: function getData() {
      if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
        this.runImporter('disk', { asset: this, sync: true });
      }

      return this.indexed;
    }
  }, {
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

    if (typeof exp === 'function') {
      return exp.call(datasource, datasource, datasource.project);
    } else {
      return exp;
    }
  }, locals)();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZGF0YV9zb3VyY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUNZLElBQUk7Ozs7Ozs7Ozs7OztBQUVoQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTtBQUN2RCxJQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7O0lBRTVDLFVBQVU7WUFBVixVQUFVOztBQUNkLFdBREksVUFBVSxDQUNELEdBQUcsRUFBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQixVQUFVOzt1RUFBVixVQUFVLGFBRU4sR0FBRyxFQUFFLE9BQU87O0FBRWxCLFVBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTthQUFNLE1BQUssS0FBSyxDQUFDLE1BQUssR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFBO0FBQy9DLFVBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTthQUFNLE1BQUssS0FBSyxDQUFDLE1BQUssTUFBTSxRQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQ3pELFVBQUssSUFBSSxDQUFDLGFBQWEsRUFBRTthQUFNLE1BQUssU0FBUyxDQUFDLE1BQUssT0FBTyxRQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQ2xFLFVBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFLLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFckMsVUFBSyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSyxVQUFDLEdBQUc7YUFBSyxHQUFHO0tBQUEsQUFBQyxDQUFBO0FBQ2hELFVBQUssV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLElBQUssVUFBQyxHQUFHO2FBQUssR0FBRztLQUFBLEFBQUMsQ0FBQTs7R0FDekQ7O2VBWEcsVUFBVTs7OEJBYUg7QUFDVCxVQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQ3BFLFlBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtPQUNwRDs7QUFFRCxhQUFPLElBQUksQ0FBQyxPQUFPLENBQUE7S0FDcEI7OzsyQkFFTyxPQUFPLEVBQUUsS0FBSyxFQUFFOzs7QUFDdEIsYUFBTyxHQUFHLE9BQU8sSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQTs7QUFFbkMsVUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLEtBQUssRUFBRTtBQUM1QixlQUFPLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtpQkFBTSxPQUFPLENBQUMsT0FBSyxLQUFLLENBQUMsUUFBUSxDQUFDO1NBQUEsQ0FBQyxDQUFBO09BQ3pFLE1BQU0sSUFBRyxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sRUFBRTtBQUNwQyxlQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFBO09BQ25DLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFBO09BRWxELE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sRUFBRTtBQUNwQyxlQUFPLEVBQUUsQ0FBQTtPQUNWLE1BQU07O0FBRUwsY0FBTyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQ3hFO0tBQ0Y7OztTQXJDRyxVQUFVOzs7QUF3Q2hCLFVBQVUsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO0FBQ2xDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBOztBQUV0QixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUE7O0FBRXJDLFNBQVMsWUFBWSxDQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUU7QUFDdkMsTUFBSSxNQUFNLEdBQUc7QUFDWCxRQUFJLEVBQUosSUFBSTtBQUNKLGNBQVUsRUFBVixVQUFVO0FBQ1YsV0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO0dBQzVCLENBQUE7O0FBRUQsU0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVU7QUFDL0IsUUFBSSxHQUFHLEdBQUcsSUFBSSxFQUFFLENBQUE7O0FBRWhCLFFBQUksT0FBTyxHQUFHLEtBQUssVUFBVSxFQUFFO0FBQzVCLGFBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUM3RCxNQUFNO0FBQ0wsYUFBTyxHQUFHLENBQUE7S0FDWDtHQUNGLEVBQUUsTUFBTSxDQUFDLEVBQUUsQ0FBQTtDQUNiIiwiZmlsZSI6ImRhdGFfc291cmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ2pzJywgJ2pzb24nLCAneWFtbCcsICd5bWwnLCAnY3N2J11cbmNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbmNsYXNzIERhdGFTb3VyY2UgZXh0ZW5kcyBBc3NldCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHVyaSwgb3B0aW9ucylcblxuICAgIHRoaXMubGF6eSgncGFyc2VkJywgKCkgPT4gdGhpcy5wYXJzZSh0aGlzLnJhdykpXG4gICAgdGhpcy5sYXp5KCdpbmRleGVkJywgKCkgPT4gdGhpcy5pbmRleCh0aGlzLnBhcnNlZCwgdGhpcykpXG4gICAgdGhpcy5sYXp5KCd0cmFuc2Zvcm1lZCcsICgpID0+IHRoaXMudHJhbnNmb3JtKHRoaXMuaW5kZXhlZCwgdGhpcykpXG4gICAgdGhpcy5sYXp5KCdkYXRhJywgdGhpcy5nZXREYXRhLCB0cnVlKVxuXG4gICAgdGhpcy5pbmRleGVyID0gb3B0aW9ucy5pbmRleGVyIHx8ICgodmFsKSA9PiB2YWwpXG4gICAgdGhpcy50cmFuc2Zvcm1lciA9IG9wdGlvbnMudHJhbnNmb3JtZXIgfHwgKCh2YWwpID0+IHZhbClcbiAgfVxuXG4gIGdldERhdGEgKCkge1xuICAgIGlmICh0aGlzLmV4dGVuc2lvbiAhPT0gJy5qcycgJiYgKCF0aGlzLnJhdyB8fCB0aGlzLnJhdy5sZW5ndGggPT09IDApKSB7XG4gICAgICB0aGlzLnJ1bkltcG9ydGVyKCdkaXNrJywge2Fzc2V0OiB0aGlzLCBzeW5jOiB0cnVlfSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5pbmRleGVkXG4gIH1cblxuICBwYXJzZXIgKGNvbnRlbnQsIGFzc2V0KSB7XG4gICAgY29udGVudCA9IGNvbnRlbnQgfHwgdGhpcy5yYXcgfHwgJydcblxuICAgIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy5qcycpIHtcbiAgICAgIHJldHVybiBoYW5kbGVTY3JpcHQuY2FsbCh0aGlzLCB0aGlzLCAoKSA9PiByZXF1aXJlKHRoaXMucGF0aHMuYWJzb2x1dGUpKVxuICAgIH0gZWxzZSBpZih0aGlzLmV4dGVuc2lvbiA9PT0gJy5qc29uJykge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoY29udGVudCB8fCAne30nKVxuICAgIH0gZWxzZSBpZiAodGhpcy5leHRlbnNpb24gPT09ICcueW1sJykge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJ2pzLXlhbWwnKS5zYWZlTG9hZChjb250ZW50IHx8ICcnKVxuXG4gICAgfSBlbHNlIGlmICh0aGlzLmV4dGVuc2lvbiA9PT0gJy5jc3YnKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aHJvdyAoJ0ltcGxlbWVudCBwYXJzZXIgZm9yICcgKyB0aGlzLmV4dGVuc2lvbiArICcgJyArIGNvbnRlbnQubGVuZ3RoKVxuICAgIH1cbiAgfVxufVxuXG5EYXRhU291cmNlLkVYVEVOU0lPTlMgPSBFWFRFTlNJT05TXG5EYXRhU291cmNlLkdMT0IgPSBHTE9CXG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IERhdGFTb3VyY2VcblxuZnVuY3Rpb24gaGFuZGxlU2NyaXB0IChkYXRhc291cmNlLCBsb2FkKSB7XG4gIGxldCBsb2NhbHMgPSB7XG4gICAgdXRpbCxcbiAgICBkYXRhc291cmNlLFxuICAgIHByb2plY3Q6IGRhdGFzb3VyY2UucHJvamVjdFxuICB9XG5cbiAgcmV0dXJuIHV0aWwubm9Db25mbGljdChmdW5jdGlvbigpe1xuICAgIGxldCBleHAgPSBsb2FkKClcblxuICAgIGlmICh0eXBlb2YgZXhwID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgcmV0dXJuIGV4cC5jYWxsKGRhdGFzb3VyY2UsIGRhdGFzb3VyY2UsIGRhdGFzb3VyY2UucHJvamVjdClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cbiAgfSwgbG9jYWxzKSgpXG59XG4iXX0=