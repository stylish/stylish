'use strict';

var _util = require('../util');

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _data_source = require('./data_source');

var _data_source2 = _interopRequireDefault(_data_source);

var _document = require('./document');

var _document2 = _interopRequireDefault(_document);

var _image = require('./image');

var _image2 = _interopRequireDefault(_image);

var _script = require('./script');

var _script2 = _interopRequireDefault(_script);

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _vector = require('./vector');

var _vector2 = _interopRequireDefault(_vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_asset2.default, {
  get SupportedExtensions() {
    return [].concat(_asset2.default.EXTENSIONS, _data_source2.default.EXTENSIONS, _document2.default.EXTENSIONS, _image2.default.EXTENSIONS, _script2.default.EXTENSIONS, _stylesheet2.default.EXTENSIONS, _vector2.default.EXTENSIONS).map(function (v) {
      return "." + v;
    });
  }
});

module.exports = {
  Asset: _asset2.default,
  DataSource: _data_source2.default,
  Document: _document2.default,
  Image: _image2.default,
  Script: _script2.default,
  Stylesheet: _stylesheet2.default,
  Vector: _vector2.default
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVBLE1BQU0sQ0FBQyxNQUFNLGtCQUFRO0FBQ25CLE1BQUksbUJBQW1CLEdBQUk7QUFDekIsV0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFNLFVBQVUsRUFBRSxzQkFBVyxVQUFVLEVBQUUsbUJBQVMsVUFBVSxFQUFFLGdCQUFNLFVBQVUsRUFBRSxpQkFBTyxVQUFVLEVBQUUscUJBQVcsVUFBVSxFQUFFLGlCQUFPLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7YUFBSSxHQUFHLEdBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQTtHQUM5SztDQUNGLENBQUMsQ0FBQTs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsT0FBSyxpQkFBQTtBQUNMLFlBQVUsdUJBQUE7QUFDVixVQUFRLG9CQUFBO0FBQ1IsT0FBSyxpQkFBQTtBQUNMLFFBQU0sa0JBQUE7QUFDTixZQUFVLHNCQUFBO0FBQ1YsUUFBTSxrQkFBQTtDQUNQLENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB2YWx1ZXMsIGZsYXR0ZW4gfSBmcm9tICcuLi91dGlsJ1xuXG5pbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcbmltcG9ydCBEYXRhU291cmNlIGZyb20gJy4vZGF0YV9zb3VyY2UnXG5pbXBvcnQgRG9jdW1lbnQgZnJvbSAnLi9kb2N1bWVudCdcbmltcG9ydCBJbWFnZSBmcm9tICcuL2ltYWdlJ1xuaW1wb3J0IFNjcmlwdCBmcm9tICcuL3NjcmlwdCdcbmltcG9ydCBTdHlsZXNoZWV0IGZyb20gJy4vc3R5bGVzaGVldCdcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi92ZWN0b3InXG5cbk9iamVjdC5hc3NpZ24oQXNzZXQsIHtcbiAgZ2V0IFN1cHBvcnRlZEV4dGVuc2lvbnMgKCkge1xuICAgIHJldHVybiBbXS5jb25jYXQoQXNzZXQuRVhURU5TSU9OUywgRGF0YVNvdXJjZS5FWFRFTlNJT05TLCBEb2N1bWVudC5FWFRFTlNJT05TLCBJbWFnZS5FWFRFTlNJT05TLCBTY3JpcHQuRVhURU5TSU9OUywgU3R5bGVzaGVldC5FWFRFTlNJT05TLCBWZWN0b3IuRVhURU5TSU9OUykubWFwKHYgPT4gXCIuXCIrdilcbiAgfVxufSlcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEFzc2V0LFxuICBEYXRhU291cmNlLFxuICBEb2N1bWVudCxcbiAgSW1hZ2UsXG4gIFNjcmlwdCxcbiAgU3R5bGVzaGVldCxcbiAgVmVjdG9yXG59XG4iXX0=