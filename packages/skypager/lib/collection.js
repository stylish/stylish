'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _path = require('path');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = (function () {
  function Collection(root, project, assetClass) {
    var _this = this;

    _classCallCheck(this, Collection);

    this.root = root;

    this.name = (0, _path.basename)(root);

    this.hidden('project', project);
    this.hidden('AssetClass', function () {
      return assetClass;
    });

    var assets = {};
    var index = {};

    var loaded = false;

    this.hidden('assets', function () {
      return assets;
    });
    this.hidden('index', function () {
      return index;
    });
    util.hide.property(this, 'expandDotPaths', function () {
      return buildAtInterface(_this, true);
    });

    // provides access to document
    if (assetClass.groupName && !this[assetClass.groupName]) {
      this.hidden(util.tabelize(assetClass.groupName), function () {
        return _this.assets;
      });
    }

    buildAtInterface(this, false);
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
      var _this2 = this;

      var patterns = [target.id + '.{' + this.AssetClass.EXTENSIONS.join(',') + '}', target.id + '/**/*.{' + this.AssetClass.EXTENSIONS.join(',') + '}'];

      return patterns.reduce(function (m, a) {
        return m.concat(_this2.glob(a));
      }, []);
    }
  }, {
    key: 'query',
    value: function query(params) {
      return util.filterQuery(this.all, params);
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

      return (_all2 = this.all).map.apply(_all2, arguments);
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

      return (_all4 = this.all).filter.apply(_all4, arguments);
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
      var _util$hidden;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_util$hidden = util.hidden).getter.apply(_util$hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return util.lazy.apply(util, [this].concat(args));
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
      var _this3 = this;

      return this.assetPaths.map(function (p) {
        return (0, _path.relative)(_this3.root, (0, _path.dirname)(p));
      }).unique().filter(function (i) {
        return i.length > 0;
      }).sort(function (a, b) {
        return a.length > b.length;
      });
    }
  }, {
    key: 'all',
    get: function get() {
      return util.values(this.assets);
    }
  }, {
    key: 'indexes',
    get: function get() {
      return Object.keys(this.index);
    }
  }, {
    key: 'available',
    get: function get() {
      return Object.keys(this.assets);
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

  Object.defineProperty(collection, 'at', {
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
//# sourceMappingURL=data:application/json;base64,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RSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDbEQsMkJBQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDaEMsQ0FBQyxDQUFBO0dBQ0g7Q0FDRjs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQSIsImZpbGUiOiJjb2xsZWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCB7cmVsYXRpdmUsIGJhc2VuYW1lLCBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlLCBqb2lufSBmcm9tICdwYXRoJ1xuaW1wb3J0IG1pbmltYXRjaCBmcm9tICdtaW5pbWF0Y2gnXG5pbXBvcnQgY2FydmUgZnJvbSAnb2JqZWN0LXBhdGgnXG5cbmNsYXNzIENvbGxlY3Rpb24ge1xuICBjb25zdHJ1Y3RvciAocm9vdCwgcHJvamVjdCwgYXNzZXRDbGFzcykge1xuICAgIHRoaXMucm9vdCA9IHJvb3RcblxuICAgIHRoaXMubmFtZSA9IGJhc2VuYW1lKHJvb3QpXG5cbiAgICB0aGlzLmhpZGRlbigncHJvamVjdCcsIHByb2plY3QpXG4gICAgdGhpcy5oaWRkZW4oJ0Fzc2V0Q2xhc3MnLCAoKSA9PiBhc3NldENsYXNzKVxuXG4gICAgY29uc3QgYXNzZXRzID0geyB9XG4gICAgY29uc3QgaW5kZXggPSB7IH1cblxuICAgIGxldCBsb2FkZWQgPSBmYWxzZVxuXG4gICAgdGhpcy5oaWRkZW4oJ2Fzc2V0cycsICgpID0+IGFzc2V0cyApXG4gICAgdGhpcy5oaWRkZW4oJ2luZGV4JywgKCkgPT4gaW5kZXggKVxuICAgIHV0aWwuaGlkZS5wcm9wZXJ0eSh0aGlzLCAnZXhwYW5kRG90UGF0aHMnLCAoKSA9PiBidWlsZEF0SW50ZXJmYWNlKHRoaXMsIHRydWUpKVxuXG4gICAgLy8gcHJvdmlkZXMgYWNjZXNzIHRvIGRvY3VtZW50XG4gICAgaWYgKGFzc2V0Q2xhc3MuZ3JvdXBOYW1lICYmICF0aGlzW2Fzc2V0Q2xhc3MuZ3JvdXBOYW1lXSkge1xuICAgICAgdGhpcy5oaWRkZW4odXRpbC50YWJlbGl6ZShhc3NldENsYXNzLmdyb3VwTmFtZSksICgpID0+IHRoaXMuYXNzZXRzIClcbiAgICB9XG5cbiAgICBidWlsZEF0SW50ZXJmYWNlKHRoaXMsIGZhbHNlKVxuICB9XG5cbiAgZ2V0IHBhdGhzKCkge1xuICAgIGxldCBjID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldCBhYnNvbHV0ZSgpe1xuICAgICAgICByZXR1cm4gYy5yb290XG4gICAgICB9LFxuICAgICAgZ2V0IHJlbGF0aXZlKCl7XG4gICAgICAgIHJldHVybiByZWxhdGl2ZShjLnByb2plY3Qucm9vdCwgYy5yb290KVxuICAgICAgfSxcbiAgICAgIGdldCBnbG9iKCkge1xuICAgICAgICByZXR1cm4gam9pbihyZWxhdGl2ZShjLnByb2plY3Qucm9vdCwgYy5yb290KSwgYy5Bc3NldENsYXNzLkdMT0IpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2xvYiAocGF0dGVybikge1xuICAgIHZhciByZWdleCA9IG1pbmltYXRjaC5tYWtlUmUocGF0dGVybilcbiAgICByZXR1cm4gdGhpcy5hbGwuZmlsdGVyKGFzc2V0ID0+IGFzc2V0LnBhdGhzLnJlbGF0aXZlICYmIHJlZ2V4LnRlc3QoYXNzZXQucGF0aHMucmVsYXRpdmUpKVxuICB9XG5cbiAgZ2V0IGFzc2V0UGF0aHMgKCkge1xuICAgIHJldHVybiB0aGlzLmFsbC5tYXAoYSA9PiBhLnVyaSlcbiAgfVxuXG4gIGdldCBzdWJmb2xkZXJQYXRocyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzZXRQYXRocy5tYXAocCA9PiByZWxhdGl2ZSh0aGlzLnJvb3QsIGRpcm5hbWUocCkpKVxuICAgIC51bmlxdWUoKVxuICAgIC5maWx0ZXIoaSA9PiBpLmxlbmd0aCA+IDApXG4gICAgLnNvcnQoKGEsIGIpID0+IGEubGVuZ3RoID4gYi5sZW5ndGgpXG4gIH1cblxuICByZWxhdGVkR2xvYiAodGFyZ2V0KSB7XG4gICAgbGV0IHBhdHRlcm5zID0gW1xuICAgICAgdGFyZ2V0LmlkICsgJy57JyArIHRoaXMuQXNzZXRDbGFzcy5FWFRFTlNJT05TLmpvaW4oJywnKSArICd9JyxcbiAgICAgIHRhcmdldC5pZCArICcvKiovKi57JyArIHRoaXMuQXNzZXRDbGFzcy5FWFRFTlNJT05TLmpvaW4oJywnKSArICd9J1xuICAgIF1cblxuICAgIHJldHVybiBwYXR0ZXJucy5yZWR1Y2UoKG0sIGEpID0+IHtcbiAgICAgIHJldHVybiBtLmNvbmNhdCh0aGlzLmdsb2IoYSkpXG4gICAgfSwgW10pXG4gIH1cblxuICBnZXQgYWxsICgpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5hc3NldHMpXG4gIH1cblxuICBnZXQgaW5kZXhlcyAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuaW5kZXgpXG4gIH1cblxuICBnZXQgYXZhaWxhYmxlICgpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcy5hc3NldHMpXG4gIH1cblxuICBxdWVyeShwYXJhbXMpIHtcbiAgICByZXR1cm4gdXRpbC5maWx0ZXJRdWVyeSh0aGlzLmFsbCwgcGFyYW1zKVxuICB9XG5cbiAgcmVkdWNlKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB0aGlzLmFsbC5yZWR1Y2UoLi4uYXJncylcbiAgfVxuXG4gIG1hcCguLi5hcmdzKXtcbiAgICByZXR1cm4gdGhpcy5hbGwubWFwKC4uLmFyZ3MpXG4gIH1cblxuICBmb3JFYWNoKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB0aGlzLmFsbC5mb3JFYWNoKC4uLmFyZ3MpXG4gIH1cblxuICBmaWx0ZXIoLi4uYXJncyl7XG4gICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlciguLi5hcmdzKVxuICB9XG5cbiAgYWRkIChhc3NldCwgYXV0b0xvYWQgPSBmYWxzZSwgZXhwYW5kRG90UGF0aCA9IGZhbHNlKSB7XG4gICAgdGhpcy5pbmRleFthc3NldC5wYXRocy5yZWxhdGl2ZV0gPSBhc3NldC5pZFxuICAgIHRoaXMuaW5kZXhbYXNzZXQucGF0aHMuYWJzb2x1dGVdID0gYXNzZXQuaWRcbiAgICB0aGlzLmluZGV4W2Fzc2V0LmlkXSA9IGFzc2V0LmlkXG4gICAgdGhpcy5hc3NldHNbYXNzZXQuaWRdID0gYXNzZXRcblxuICAgIGlmIChhdXRvTG9hZCkgeyBhc3NldC5ydW5JbXBvcnRlcigpIH1cblxuICAgIC8vIGV4cGFuZCB0aGUgZG90IHBhdGggd2hlbiBhIGNvbGxlY3Rpb24gaXMgYWxyZWFkeSBsb2FkZWQgYW5kIGEgbmV3IGFzc2V0IGlzIGFkZGVkXG4gICAgaWYgKGV4cGFuZERvdFBhdGgpIHtcbiAgICAgIGNhcnZlLnNldCh0aGlzLmF0LCBhc3NldC5pZFBhdGgsIGFzc2V0KVxuICAgIH1cbiAgfVxuXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cblxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIF9kaWRMb2FkQXNzZXRzIChwYXRocywgZXhwYW5kKSB7XG4gICAgaWYgKGV4cGFuZCkge1xuICAgICAgdGhpcy5leHBhbmREb3RQYXRocygpXG4gICAgfVxuICB9XG5cbiAgX3dpbGxMb2FkQXNzZXRzIChwYXRocykge1xuICB9XG59XG5cbi8qKlxuKiBUaGlzIHVzZXMgb2JqZWN0LXBhdGggaG93ZXZlciBJIHNob3VsZCB3cml0ZSBhIGZ1bmN0aW9uXG4qIHdoaWNoIHVzZXMgZ2V0dGVycyB0byBkeW5hbWljYWxseSBidWlsZCB0aGUgcGF0aCBmb3J3YXJkXG4qIGluc3RlYWQsIHNpbmNlIHRoZSB0cmVlIGNhbiBjaGFuZ2VcbiovXG5mdW5jdGlvbiBidWlsZEF0SW50ZXJmYWNlIChjb2xsZWN0aW9uLCBleHBhbmQgPSB0cnVlKSB7XG4gIGxldCBjaGFpbiA9IGZ1bmN0aW9uIChuZWVkbGUpIHtcbiAgICBsZXQgcG9pbnRlciA9IHRoaXMuaW5kZXhbbmVlZGxlXVxuICAgIHJldHVybiB0aGlzLmFzc2V0c1twb2ludGVyXVxuICB9LmJpbmQoY29sbGVjdGlvbilcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29sbGVjdGlvbiwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gY29sbGVjdGlvbi5hdmFpbGFibGUubWFwKGlkUGF0aCA9PiBpZFBhdGguc3BsaXQoJy8nKSkuc29ydCgoYSwgYikgPT4gYS5sZW5ndGggPiBiLmxlbmd0aClcblxuICAgIGV4cGFuZGVkLmZvckVhY2goaWQgPT4ge1xuICAgICAgbGV0IGRwID0gaWQucmVwbGFjZSgvLS9nLCAnXycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG4gICAgICBjYXJ2ZS5zZXQoY2hhaW4sIGRwLCBjaGFpbihpZCkpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25cbiJdfQ==