'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _util = require('./util');

var _path = require('path');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = (function () {
  function Collection(root, project, assetClass) {
    _classCallCheck(this, Collection);

    var collection = this;

    collection.root = root;

    collection.name = (0, _path.basename)(root);

    collection.hidden('project', project);
    collection.hidden('AssetClass', function () {
      return assetClass;
    });

    var assets = {};
    var index = {};

    var loaded = false;

    collection.hidden('assets', function () {
      return assets;
    });
    collection.hidden('index', function () {
      return index;
    });
    _util.hide.property(collection, 'expandDotPaths', function () {
      return buildAtInterface(collection, true);
    });

    // provides access to document
    if (assetClass.groupName && !collection[assetClass.groupName]) {
      collection.hidden((0, _util.tabelize)(assetClass.groupName), function () {
        return collection.assets;
      });
    }

    buildAtInterface(collection, false);
  }

  _createClass(Collection, [{
    key: 'glob',
    value: function glob(pattern) {
      var regex = _minimatch2.default.makeRe(pattern);
      return this.all.filter(function (asset) {
        return asset.paths.relative && regex.test(asset.paths.relative);
      });
    }
  }, {
    key: 'relatedGlob',
    value: function relatedGlob(target) {
      var _this = this;

      var patterns = [target.id + '.{' + this.AssetClass.EXTENSIONS.join(',') + '}', target.id + '/**/*.{' + this.AssetClass.EXTENSIONS.join(',') + '}'];

      return patterns.reduce(function (m, a) {
        return m.concat(_this.glob(a));
      }, []);
    }
  }, {
    key: 'query',
    value: function query() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return wrapCollection(this, (0, _util.filterQuery)(this.all, params));
    }
  }, {
    key: 'reduce',
    value: function reduce() {
      var _all;

      return (_all = this.all).reduce.apply(_all, arguments);
    }
  }, {
    key: 'map',
    value: function map() {
      var _all2;

      return wrapCollection(this, (_all2 = this.all).map.apply(_all2, arguments));
    }
  }, {
    key: 'forEach',
    value: function forEach() {
      var _all3;

      return (_all3 = this.all).forEach.apply(_all3, arguments);
    }
  }, {
    key: 'filter',
    value: function filter() {
      var _all4;

      return wrapCollection(this, (_all4 = this.all).filter.apply(_all4, arguments));
    }
  }, {
    key: 'add',
    value: function add(asset) {
      var autoLoad = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var expandDotPath = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

      this.index[asset.paths.relative] = asset.id;
      this.index[asset.paths.absolute] = asset.id;
      this.index[asset.id] = asset.id;
      this.assets[asset.id] = asset;

      if (autoLoad) {
        asset.runImporter();
      }

      // expand the dot path when a collection is already loaded and a new asset is added
      if (expandDotPath) {
        _objectPath2.default.set(this.at, asset.idPath, asset);
      }
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _util.hidden.getter.apply(_util.hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _util.lazy.apply(undefined, [this].concat(args));
    }
  }, {
    key: '_didLoadAssets',
    value: function _didLoadAssets(paths, expand) {
      if (expand) {
        this.expandDotPaths();
      }
    }
  }, {
    key: '_willLoadAssets',
    value: function _willLoadAssets(paths) {}
  }, {
    key: 'paths',
    get: function get() {
      var c = this;

      return {
        get absolute() {
          return c.root;
        },
        get relative() {
          return (0, _path.relative)(c.project.root, c.root);
        },
        get glob() {
          return (0, _path.join)((0, _path.relative)(c.project.root, c.root), c.AssetClass.GLOB);
        }
      };
    }
  }, {
    key: 'assetPaths',
    get: function get() {
      return this.all.map(function (a) {
        return a.uri;
      });
    }
  }, {
    key: 'subfolderPaths',
    get: function get() {
      var _this2 = this;

      return this.assetPaths.map(function (p) {
        return (0, _path.relative)(_this2.root, (0, _path.dirname)(p));
      }).unique().filter(function (i) {
        return i.length > 0;
      }).sort(function (a, b) {
        return a.length > b.length;
      });
    }
  }, {
    key: 'all',
    get: function get() {
      return (0, _util.values)(this.assets);
    }
  }, {
    key: 'indexes',
    get: function get() {
      return keys(this.index);
    }
  }, {
    key: 'available',
    get: function get() {
      return keys(this.assets);
    }
  }]);

  return Collection;
})();

/**
* This uses object-path however I should write a function
* which uses getters to dynamically build the path forward
* instead, since the tree can change
*/

function buildAtInterface(collection) {
  var expand = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var chain = (function (needle) {
    var pointer = this.index[needle];
    return this.assets[pointer];
  }).bind(collection);

  defineProperty(collection, 'at', {
    configurable: true,
    enumerable: false,
    value: chain
  });

  if (expand) {
    var expanded = collection.available.map(function (idPath) {
      return idPath.split('/');
    }).sort(function (a, b) {
      return a.length > b.length;
    });

    expanded.forEach(function (id) {
      var dp = id.replace(/-/g, '_').replace(/\//g, '.');
      _objectPath2.default.set(chain, dp, chain(id));
    });
  }
}

module.exports = Collection;

function wrapCollection(collection, array) {
  Object.defineProperty(array, 'condense', {
    enumerable: false,
    value: function condense() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var prop = options.prop;
      var key = options.key;

      if (typeof key === 'undefined') {
        key = 'id';
      }

      return array.reduce(function (memo, a) {
        var asset = prop ? a[prop] : a;
        var payload = key ? _defineProperty({}, a[key], asset) : asset;

        return assign(memo, payload);
      }, {});
    }
  });

  Object.defineProperty(array, 'merge', {
    enumerable: false,
    value: function merge() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return array.condense({ key: false, prop: options.prop || 'data' });
    }
  });

  return array;
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var defineProperty = _Object.defineProperty;
//# sourceMappingURL=data:application/json;base64,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OztBQUVGLFFBQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtBQUNwQyxjQUFVLEVBQUUsS0FBSztBQUNqQixTQUFLLEVBQUUsU0FBUyxLQUFLLEdBQWU7VUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ2hDLGFBQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFDLENBQUMsQ0FBQTtLQUNsRTtHQUNGLENBQUMsQ0FBQTs7QUFFRixTQUFPLEtBQUssQ0FBQTtDQUNiOztjQUV3QyxNQUFNO0lBQXZDLE1BQU0sV0FBTixNQUFNO0lBQUUsSUFBSSxXQUFKLElBQUk7SUFBRSxjQUFjLFdBQWQsY0FBYyIsImZpbGUiOiJjb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQge2ZpbHRlclF1ZXJ5IGFzIHF1ZXJ5LCBoaWRlLCBoaWRkZW4sIGxhenksIHRhYmVsaXplLCB2YWx1ZXN9IGZyb20gJy4vdXRpbCdcbmltcG9ydCB7cmVsYXRpdmUsIGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlLCBqb2lufSBmcm9tICdwYXRoJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgY2FydmUgZnJvbSAnb2JqZWN0LXBhdGgnXG5cbmNsYXNzIENvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvciAocm9vdCwgcHJvamVjdCwgYXNzZXRDbGFzcykge1xuICAgIGxldCBjb2xsZWN0aW9uID0gdGhpc1xuXG4gICAgY29sbGVjdGlvbi5yb290ID0gcm9vdFxuXG4gICAgY29sbGVjdGlvbi5uYW1lID0gYmFzZW5hbWUocm9vdClcblxuICAgIGNvbGxlY3Rpb24uaGlkZGVuKCdwcm9qZWN0JywgcHJvamVjdClcbiAgICBjb2xsZWN0aW9uLmhpZGRlbignQXNzZXRDbGFzcycsICgpID0+IGFzc2V0Q2xhc3MpXG5cbiAgICBjb25zdCBhc3NldHMgPSB7IH1cbiAgICBjb25zdCBpbmRleCA9IHsgfVxuXG4gICAgbGV0IGxvYWRlZCA9IGZhbHNlXG5cbiAgICBjb2xsZWN0aW9uLmhpZGRlbignYXNzZXRzJywgKCkgPT4gYXNzZXRzIClcbiAgICBjb2xsZWN0aW9uLmhpZGRlbignaW5kZXgnLCAoKSA9PiBpbmRleCApXG4gICAgaGlkZS5wcm9wZXJ0eShjb2xsZWN0aW9uLCAnZXhwYW5kRG90UGF0aHMnLCAoKSA9PiBidWlsZEF0SW50ZXJmYWNlKGNvbGxlY3Rpb24sIHRydWUpKVxuXG4gICAgLy8gcHJvdmlkZXMgYWNjZXNzIHRvIGRvY3VtZW50XG4gICAgaWYgKGFzc2V0Q2xhc3MuZ3JvdXBOYW1lICYmICFjb2xsZWN0aW9uW2Fzc2V0Q2xhc3MuZ3JvdXBOYW1lXSkge1xuICAgICAgY29sbGVjdGlvbi5oaWRkZW4odGFiZWxpemUoYXNzZXRDbGFzcy5ncm91cE5hbWUpLCAoKSA9PiBjb2xsZWN0aW9uLmFzc2V0cyApXG4gICAgfVxuXG4gICAgYnVpbGRBdEludGVyZmFjZShjb2xsZWN0aW9uLCBmYWxzZSlcbiAgfVxuXG4gIGdldCBwYXRocygpIHtcbiAgICBsZXQgYyA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBnZXQgYWJzb2x1dGUoKXtcbiAgICAgICAgcmV0dXJuIGMucm9vdFxuICAgICAgfSxcbiAgICAgIGdldCByZWxhdGl2ZSgpe1xuICAgICAgICByZXR1cm4gcmVsYXRpdmUoYy5wcm9qZWN0LnJvb3QsIGMucm9vdClcbiAgICAgIH0sXG4gICAgICBnZXQgZ2xvYigpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4ocmVsYXRpdmUoYy5wcm9qZWN0LnJvb3QsIGMucm9vdCksIGMuQXNzZXRDbGFzcy5HTE9CKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdsb2IgKHBhdHRlcm4pIHtcbiAgICB2YXIgcmVnZXggPSBtaW5pbWF0Y2gubWFrZVJlKHBhdHRlcm4pXG4gICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlcihhc3NldCA9PiBhc3NldC5wYXRocy5yZWxhdGl2ZSAmJiByZWdleC50ZXN0KGFzc2V0LnBhdGhzLnJlbGF0aXZlKSlcbiAgfVxuXG4gIGdldCBhc3NldFBhdGhzICgpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwubWFwKGEgPT4gYS51cmkpXG4gIH1cblxuICBnZXQgc3ViZm9sZGVyUGF0aHMgKCkge1xuICAgIHJldHVybiB0aGlzLmFzc2V0UGF0aHMubWFwKHAgPT4gcmVsYXRpdmUodGhpcy5yb290LCBkaXJuYW1lKHApKSlcbiAgICAudW5pcXVlKClcbiAgICAuZmlsdGVyKGkgPT4gaS5sZW5ndGggPiAwKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuICB9XG5cbiAgcmVsYXRlZEdsb2IgKHRhcmdldCkge1xuICAgIGxldCBwYXR0ZXJucyA9IFtcbiAgICAgIHRhcmdldC5pZCArICcueycgKyB0aGlzLkFzc2V0Q2xhc3MuRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfScsXG4gICAgICB0YXJnZXQuaWQgKyAnLyoqLyoueycgKyB0aGlzLkFzc2V0Q2xhc3MuRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcbiAgICBdXG5cbiAgICByZXR1cm4gcGF0dGVybnMucmVkdWNlKChtLCBhKSA9PiB7XG4gICAgICByZXR1cm4gbS5jb25jYXQodGhpcy5nbG9iKGEpKVxuICAgIH0sIFtdKVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgcmV0dXJuIHZhbHVlcyh0aGlzLmFzc2V0cylcbiAgfVxuXG4gIGdldCBpbmRleGVzICgpIHtcbiAgICByZXR1cm4ga2V5cyh0aGlzLmluZGV4KVxuICB9XG5cbiAgZ2V0IGF2YWlsYWJsZSAoKSB7XG4gICAgcmV0dXJuIGtleXModGhpcy5hc3NldHMpXG4gIH1cblxuICBxdWVyeShwYXJhbXMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgcmV0dXJuIHdyYXBDb2xsZWN0aW9uKHRoaXMsIHF1ZXJ5KHRoaXMuYWxsLCBwYXJhbXMpKVxuICB9XG5cbiAgcmVkdWNlKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB0aGlzLmFsbC5yZWR1Y2UoLi4uYXJncylcbiAgfVxuXG4gIG1hcCguLi5hcmdzKXtcbiAgICByZXR1cm4gd3JhcENvbGxlY3Rpb24odGhpcywgdGhpcy5hbGwubWFwKC4uLmFyZ3MpKVxuICB9XG5cbiAgZm9yRWFjaCguLi5hcmdzKXtcbiAgICByZXR1cm4gdGhpcy5hbGwuZm9yRWFjaCguLi5hcmdzKVxuICB9XG5cbiAgZmlsdGVyKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB3cmFwQ29sbGVjdGlvbih0aGlzLCB0aGlzLmFsbC5maWx0ZXIoLi4uYXJncykpXG4gIH1cblxuICBhZGQgKGFzc2V0LCBhdXRvTG9hZCA9IGZhbHNlLCBleHBhbmREb3RQYXRoID0gZmFsc2UpIHtcbiAgICB0aGlzLmluZGV4W2Fzc2V0LnBhdGhzLnJlbGF0aXZlXSA9IGFzc2V0LmlkXG4gICAgdGhpcy5pbmRleFthc3NldC5wYXRocy5hYnNvbHV0ZV0gPSBhc3NldC5pZFxuICAgIHRoaXMuaW5kZXhbYXNzZXQuaWRdID0gYXNzZXQuaWRcbiAgICB0aGlzLmFzc2V0c1thc3NldC5pZF0gPSBhc3NldFxuXG4gICAgaWYgKGF1dG9Mb2FkKSB7IGFzc2V0LnJ1bkltcG9ydGVyKCkgfVxuXG4gICAgLy8gZXhwYW5kIHRoZSBkb3QgcGF0aCB3aGVuIGEgY29sbGVjdGlvbiBpcyBhbHJlYWR5IGxvYWRlZCBhbmQgYSBuZXcgYXNzZXQgaXMgYWRkZWRcbiAgICBpZiAoZXhwYW5kRG90UGF0aCkge1xuICAgICAgY2FydmUuc2V0KHRoaXMuYXQsIGFzc2V0LmlkUGF0aCwgYXNzZXQpXG4gICAgfVxuICB9XG5cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiBoaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cblxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiBsYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICBfZGlkTG9hZEFzc2V0cyAocGF0aHMsIGV4cGFuZCkge1xuICAgIGlmIChleHBhbmQpIHtcbiAgICAgIHRoaXMuZXhwYW5kRG90UGF0aHMoKVxuICAgIH1cbiAgfVxuXG4gIF93aWxsTG9hZEFzc2V0cyAocGF0aHMpIHtcbiAgfVxufVxuXG4vKipcbiogVGhpcyB1c2VzIG9iamVjdC1wYXRoIGhvd2V2ZXIgSSBzaG91bGQgd3JpdGUgYSBmdW5jdGlvblxuKiB3aGljaCB1c2VzIGdldHRlcnMgdG8gZHluYW1pY2FsbHkgYnVpbGQgdGhlIHBhdGggZm9yd2FyZFxuKiBpbnN0ZWFkLCBzaW5jZSB0aGUgdHJlZSBjYW4gY2hhbmdlXG4qL1xuZnVuY3Rpb24gYnVpbGRBdEludGVyZmFjZSAoY29sbGVjdGlvbiwgZXhwYW5kID0gdHJ1ZSkge1xuICBsZXQgY2hhaW4gPSBmdW5jdGlvbiAobmVlZGxlKSB7XG4gICAgbGV0IHBvaW50ZXIgPSB0aGlzLmluZGV4W25lZWRsZV1cbiAgICByZXR1cm4gdGhpcy5hc3NldHNbcG9pbnRlcl1cbiAgfS5iaW5kKGNvbGxlY3Rpb24pXG5cbiAgZGVmaW5lUHJvcGVydHkoY29sbGVjdGlvbiwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gY29sbGVjdGlvbi5hdmFpbGFibGUubWFwKGlkUGF0aCA9PiBpZFBhdGguc3BsaXQoJy8nKSkuc29ydCgoYSwgYikgPT4gYS5sZW5ndGggPiBiLmxlbmd0aClcblxuICAgIGV4cGFuZGVkLmZvckVhY2goaWQgPT4ge1xuICAgICAgbGV0IGRwID0gaWQucmVwbGFjZSgvLS9nLCAnXycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG4gICAgICBjYXJ2ZS5zZXQoY2hhaW4sIGRwLCBjaGFpbihpZCkpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25cblxuZnVuY3Rpb24gd3JhcENvbGxlY3Rpb24oY29sbGVjdGlvbiwgYXJyYXkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LCAnY29uZGVuc2UnLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNvbmRlbnNlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgbGV0IHtwcm9wLGtleX0gPSBvcHRpb25zXG5cbiAgICAgIGlmICh0eXBlb2Yga2V5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBrZXkgPSAnaWQnXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcnJheS5yZWR1Y2UoKG1lbW8sYSkgPT4ge1xuICAgICAgICBsZXQgYXNzZXQgPSBwcm9wID8gYVtwcm9wXSA6IGFcbiAgICAgICAgbGV0IHBheWxvYWQgPSBrZXkgPyB7IFthW2tleV1dOiBhc3NldCB9IDogYXNzZXRcblxuICAgICAgICByZXR1cm4gYXNzaWduKG1lbW8sIHBheWxvYWQpXG4gICAgICB9LCB7fSlcbiAgICB9XG4gIH0pXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFycmF5LCAnbWVyZ2UnLCB7XG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1lcmdlKG9wdGlvbnMgPSB7fSkge1xuICAgICAgcmV0dXJuIGFycmF5LmNvbmRlbnNlKHtrZXk6IGZhbHNlLCBwcm9wOiBvcHRpb25zLnByb3AgfHwgJ2RhdGEnfSlcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGFycmF5XG59XG5cbmNvbnN0IHsgYXNzaWduLCBrZXlzLCBkZWZpbmVQcm9wZXJ0eSB9ID0gT2JqZWN0XG4iXX0=