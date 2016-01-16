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
    key: 'filter',
    value: function filter() {
      var _all3;

      return (_all3 = this.all).filter.apply(_all3, arguments);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb2xsZWN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFDWSxJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLVixVQUFVO0FBQ2QsV0FESSxVQUFVLENBQ0QsSUFBSSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUU7OzswQkFEcEMsVUFBVTs7QUFFWixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTs7QUFFaEIsUUFBSSxDQUFDLElBQUksR0FBRyxVQVJFLFFBQVEsRUFRRCxJQUFJLENBQUMsQ0FBQTs7QUFFMUIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDL0IsUUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7YUFBTSxVQUFVO0tBQUEsQ0FBQyxDQUFBOztBQUUzQyxRQUFNLE1BQU0sR0FBRyxFQUFHLENBQUE7QUFDbEIsUUFBTSxLQUFLLEdBQUcsRUFBRyxDQUFBOztBQUVqQixRQUFJLE1BQU0sR0FBRyxLQUFLLENBQUE7O0FBRWxCLFFBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBTTtLQUFBLENBQUUsQ0FBQTtBQUNwQyxRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTthQUFNLEtBQUs7S0FBQSxDQUFFLENBQUE7QUFDbEMsUUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2FBQU0sZ0JBQWdCLFFBQU8sSUFBSSxDQUFDO0tBQUEsQ0FBQzs7O0FBQUEsQUFHOUUsUUFBSSxVQUFVLENBQUMsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUN2RCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2VBQU0sTUFBSyxNQUFNO09BQUEsQ0FBRSxDQUFBO0tBQ3JFOztBQUVELG9CQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtHQUM5Qjs7ZUF4QkcsVUFBVTs7eUJBMENSLE9BQU8sRUFBRTtBQUNiLFVBQUksS0FBSyxHQUFHLG9CQUFVLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQUNyQyxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7T0FBQSxDQUFDLENBQUE7S0FDMUY7OztnQ0FhWSxNQUFNLEVBQUU7OztBQUNuQixVQUFJLFFBQVEsR0FBRyxDQUNiLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQzdELE1BQU0sQ0FBQyxFQUFFLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQ25FLENBQUE7O0FBRUQsYUFBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBSztBQUMvQixlQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUM5QixFQUFFLEVBQUUsQ0FBQyxDQUFBO0tBQ1A7Ozs2QkFjYzs7O0FBQ2IsYUFBTyxRQUFBLElBQUksQ0FBQyxHQUFHLEVBQUMsTUFBTSxNQUFBLGlCQUFTLENBQUE7S0FDaEM7OzswQkFFVzs7O0FBQ1YsYUFBTyxTQUFBLElBQUksQ0FBQyxHQUFHLEVBQUMsR0FBRyxNQUFBLGtCQUFTLENBQUE7S0FDN0I7Ozs2QkFFYzs7O0FBQ2IsYUFBTyxTQUFBLElBQUksQ0FBQyxHQUFHLEVBQUMsTUFBTSxNQUFBLGtCQUFTLENBQUE7S0FDaEM7Ozt3QkFFSSxLQUFLLEVBQTJDO1VBQXpDLFFBQVEseURBQUcsS0FBSztVQUFFLGFBQWEseURBQUcsS0FBSzs7QUFDakQsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUE7QUFDM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUE7QUFDM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQTtBQUMvQixVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUE7O0FBRTdCLFVBQUksUUFBUSxFQUFFO0FBQUUsYUFBSyxDQUFDLFdBQVcsRUFBRSxDQUFBO09BQUU7OztBQUFBLEFBR3JDLFVBQUksYUFBYSxFQUFFO0FBQ2pCLDZCQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUE7T0FDeEM7S0FDRjs7OzZCQUVnQjs7O3dDQUFOLElBQUk7QUFBSixZQUFJOzs7QUFBSSxhQUFPLGdCQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsTUFBTSxNQUFBLGdCQUFDLElBQUksU0FBSyxJQUFJLEVBQUMsQ0FBQTtLQUFFOzs7MkJBRTlDO3lDQUFOLElBQUk7QUFBSixZQUFJOzs7QUFBSSxhQUFPLElBQUksQ0FBQyxJQUFJLE1BQUEsQ0FBVCxJQUFJLEdBQU0sSUFBSSxTQUFLLElBQUksRUFBQyxDQUFBO0tBQUU7OzttQ0FFbEMsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUM3QixVQUFJLE1BQU0sRUFBRTtBQUNWLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtPQUN0QjtLQUNGOzs7b0NBRWdCLEtBQUssRUFBRSxFQUN2Qjs7O3dCQTVGVztBQUNWLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQTs7QUFFWixhQUFPO0FBQ0wsWUFBSSxRQUFRLEdBQUU7QUFDWixpQkFBTyxDQUFDLENBQUMsSUFBSSxDQUFBO1NBQ2Q7QUFDRCxZQUFJLFFBQVEsR0FBRTtBQUNaLGlCQUFPLFVBdENQLFFBQVEsRUFzQ1EsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3hDO0FBQ0QsWUFBSSxJQUFJLEdBQUc7QUFDVCxpQkFBTyxVQXpDd0MsSUFBSSxFQXlDdkMsVUF6Q1osUUFBUSxFQXlDYSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNqRTtPQUNGLENBQUE7S0FDRjs7O3dCQU9pQjtBQUNoQixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxHQUFHO09BQUEsQ0FBQyxDQUFBO0tBQ2hDOzs7d0JBRXFCOzs7QUFDcEIsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7ZUFBSSxVQXhENUIsUUFBUSxFQXdENkIsT0FBSyxJQUFJLEVBQUUsVUF4RDVCLE9BQU8sRUF3RDZCLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUMvRCxNQUFNLEVBQUUsQ0FDUixNQUFNLENBQUMsVUFBQSxDQUFDO2VBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO09BQUEsQ0FBQyxDQUN6QixJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztlQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU07T0FBQSxDQUFDLENBQUE7S0FDckM7Ozt3QkFhVTtBQUNULGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDaEM7Ozt3QkFFYztBQUNiLGFBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDL0I7Ozt3QkFFZ0I7QUFDZixhQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2hDOzs7U0EvRUcsVUFBVTs7Ozs7Ozs7O0FBOEhoQixTQUFTLGdCQUFnQixDQUFFLFVBQVUsRUFBaUI7TUFBZixNQUFNLHlEQUFHLElBQUk7O0FBQ2xELE1BQUksS0FBSyxHQUFHLENBQUEsVUFBVSxNQUFNLEVBQUU7QUFDNUIsUUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNoQyxXQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDNUIsQ0FBQSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTs7QUFFbEIsUUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFO0FBQ3RDLGdCQUFZLEVBQUUsSUFBSTtBQUNsQixjQUFVLEVBQUUsS0FBSztBQUNqQixTQUFLLEVBQUUsS0FBSztHQUNiLENBQUMsQ0FBQTs7QUFFRixNQUFJLE1BQU0sRUFBRTtBQUNWLFFBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTTthQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0tBQUEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2FBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTTtLQUFBLENBQUMsQ0FBQTs7QUFFeEcsWUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEVBQUUsRUFBSTtBQUNyQixVQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQ2xELDJCQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0tBQ2hDLENBQUMsQ0FBQTtHQUNIO0NBQ0Y7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUEiLCJmaWxlIjoiY29sbGVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTa3lwYWdlciBmcm9tICcuL2luZGV4J1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5pbXBvcnQge3JlbGF0aXZlLCBiYXNlbmFtZSwgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSwgam9pbn0gZnJvbSAncGF0aCdcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJ1xuaW1wb3J0IGNhcnZlIGZyb20gJ29iamVjdC1wYXRoJ1xuXG5jbGFzcyBDb2xsZWN0aW9uIHtcbiAgY29uc3RydWN0b3IgKHJvb3QsIHByb2plY3QsIGFzc2V0Q2xhc3MpIHtcbiAgICB0aGlzLnJvb3QgPSByb290XG5cbiAgICB0aGlzLm5hbWUgPSBiYXNlbmFtZShyb290KVxuXG4gICAgdGhpcy5oaWRkZW4oJ3Byb2plY3QnLCBwcm9qZWN0KVxuICAgIHRoaXMuaGlkZGVuKCdBc3NldENsYXNzJywgKCkgPT4gYXNzZXRDbGFzcylcblxuICAgIGNvbnN0IGFzc2V0cyA9IHsgfVxuICAgIGNvbnN0IGluZGV4ID0geyB9XG5cbiAgICBsZXQgbG9hZGVkID0gZmFsc2VcblxuICAgIHRoaXMuaGlkZGVuKCdhc3NldHMnLCAoKSA9PiBhc3NldHMgKVxuICAgIHRoaXMuaGlkZGVuKCdpbmRleCcsICgpID0+IGluZGV4IClcbiAgICB1dGlsLmhpZGUucHJvcGVydHkodGhpcywgJ2V4cGFuZERvdFBhdGhzJywgKCkgPT4gYnVpbGRBdEludGVyZmFjZSh0aGlzLCB0cnVlKSlcblxuICAgIC8vIHByb3ZpZGVzIGFjY2VzcyB0byBkb2N1bWVudFxuICAgIGlmIChhc3NldENsYXNzLmdyb3VwTmFtZSAmJiAhdGhpc1thc3NldENsYXNzLmdyb3VwTmFtZV0pIHtcbiAgICAgIHRoaXMuaGlkZGVuKHV0aWwudGFiZWxpemUoYXNzZXRDbGFzcy5ncm91cE5hbWUpLCAoKSA9PiB0aGlzLmFzc2V0cyApXG4gICAgfVxuXG4gICAgYnVpbGRBdEludGVyZmFjZSh0aGlzLCBmYWxzZSlcbiAgfVxuXG4gIGdldCBwYXRocygpIHtcbiAgICBsZXQgYyA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBnZXQgYWJzb2x1dGUoKXtcbiAgICAgICAgcmV0dXJuIGMucm9vdFxuICAgICAgfSxcbiAgICAgIGdldCByZWxhdGl2ZSgpe1xuICAgICAgICByZXR1cm4gcmVsYXRpdmUoYy5wcm9qZWN0LnJvb3QsIGMucm9vdClcbiAgICAgIH0sXG4gICAgICBnZXQgZ2xvYigpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4ocmVsYXRpdmUoYy5wcm9qZWN0LnJvb3QsIGMucm9vdCksIGMuQXNzZXRDbGFzcy5HTE9CKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdsb2IgKHBhdHRlcm4pIHtcbiAgICB2YXIgcmVnZXggPSBtaW5pbWF0Y2gubWFrZVJlKHBhdHRlcm4pXG4gICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlcihhc3NldCA9PiBhc3NldC5wYXRocy5yZWxhdGl2ZSAmJiByZWdleC50ZXN0KGFzc2V0LnBhdGhzLnJlbGF0aXZlKSlcbiAgfVxuXG4gIGdldCBhc3NldFBhdGhzICgpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwubWFwKGEgPT4gYS51cmkpXG4gIH1cblxuICBnZXQgc3ViZm9sZGVyUGF0aHMgKCkge1xuICAgIHJldHVybiB0aGlzLmFzc2V0UGF0aHMubWFwKHAgPT4gcmVsYXRpdmUodGhpcy5yb290LCBkaXJuYW1lKHApKSlcbiAgICAudW5pcXVlKClcbiAgICAuZmlsdGVyKGkgPT4gaS5sZW5ndGggPiAwKVxuICAgIC5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuICB9XG5cbiAgcmVsYXRlZEdsb2IgKHRhcmdldCkge1xuICAgIGxldCBwYXR0ZXJucyA9IFtcbiAgICAgIHRhcmdldC5pZCArICcueycgKyB0aGlzLkFzc2V0Q2xhc3MuRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfScsXG4gICAgICB0YXJnZXQuaWQgKyAnLyoqLyoueycgKyB0aGlzLkFzc2V0Q2xhc3MuRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcbiAgICBdXG5cbiAgICByZXR1cm4gcGF0dGVybnMucmVkdWNlKChtLCBhKSA9PiB7XG4gICAgICByZXR1cm4gbS5jb25jYXQodGhpcy5nbG9iKGEpKVxuICAgIH0sIFtdKVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuYXNzZXRzKVxuICB9XG5cbiAgZ2V0IGluZGV4ZXMgKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLmluZGV4KVxuICB9XG5cbiAgZ2V0IGF2YWlsYWJsZSAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuYXNzZXRzKVxuICB9XG5cbiAgcmVkdWNlKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB0aGlzLmFsbC5yZWR1Y2UoLi4uYXJncylcbiAgfVxuXG4gIG1hcCguLi5hcmdzKXtcbiAgICByZXR1cm4gdGhpcy5hbGwubWFwKC4uLmFyZ3MpXG4gIH1cblxuICBmaWx0ZXIoLi4uYXJncyl7XG4gICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlciguLi5hcmdzKVxuICB9XG5cbiAgYWRkIChhc3NldCwgYXV0b0xvYWQgPSBmYWxzZSwgZXhwYW5kRG90UGF0aCA9IGZhbHNlKSB7XG4gICAgdGhpcy5pbmRleFthc3NldC5wYXRocy5yZWxhdGl2ZV0gPSBhc3NldC5pZFxuICAgIHRoaXMuaW5kZXhbYXNzZXQucGF0aHMuYWJzb2x1dGVdID0gYXNzZXQuaWRcbiAgICB0aGlzLmluZGV4W2Fzc2V0LmlkXSA9IGFzc2V0LmlkXG4gICAgdGhpcy5hc3NldHNbYXNzZXQuaWRdID0gYXNzZXRcblxuICAgIGlmIChhdXRvTG9hZCkgeyBhc3NldC5ydW5JbXBvcnRlcigpIH1cblxuICAgIC8vIGV4cGFuZCB0aGUgZG90IHBhdGggd2hlbiBhIGNvbGxlY3Rpb24gaXMgYWxyZWFkeSBsb2FkZWQgYW5kIGEgbmV3IGFzc2V0IGlzIGFkZGVkXG4gICAgaWYgKGV4cGFuZERvdFBhdGgpIHtcbiAgICAgIGNhcnZlLnNldCh0aGlzLmF0LCBhc3NldC5pZFBhdGgsIGFzc2V0KVxuICAgIH1cbiAgfVxuXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cblxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIF9kaWRMb2FkQXNzZXRzIChwYXRocywgZXhwYW5kKSB7XG4gICAgaWYgKGV4cGFuZCkge1xuICAgICAgdGhpcy5leHBhbmREb3RQYXRocygpXG4gICAgfVxuICB9XG5cbiAgX3dpbGxMb2FkQXNzZXRzIChwYXRocykge1xuICB9XG59XG5cbi8qKlxuKiBUaGlzIHVzZXMgb2JqZWN0LXBhdGggaG93ZXZlciBJIHNob3VsZCB3cml0ZSBhIGZ1bmN0aW9uXG4qIHdoaWNoIHVzZXMgZ2V0dGVycyB0byBkeW5hbWljYWxseSBidWlsZCB0aGUgcGF0aCBmb3J3YXJkXG4qIGluc3RlYWQsIHNpbmNlIHRoZSB0cmVlIGNhbiBjaGFuZ2VcbiovXG5mdW5jdGlvbiBidWlsZEF0SW50ZXJmYWNlIChjb2xsZWN0aW9uLCBleHBhbmQgPSB0cnVlKSB7XG4gIGxldCBjaGFpbiA9IGZ1bmN0aW9uIChuZWVkbGUpIHtcbiAgICBsZXQgcG9pbnRlciA9IHRoaXMuaW5kZXhbbmVlZGxlXVxuICAgIHJldHVybiB0aGlzLmFzc2V0c1twb2ludGVyXVxuICB9LmJpbmQoY29sbGVjdGlvbilcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29sbGVjdGlvbiwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gY29sbGVjdGlvbi5hdmFpbGFibGUubWFwKGlkUGF0aCA9PiBpZFBhdGguc3BsaXQoJy8nKSkuc29ydCgoYSwgYikgPT4gYS5sZW5ndGggPiBiLmxlbmd0aClcblxuICAgIGV4cGFuZGVkLmZvckVhY2goaWQgPT4ge1xuICAgICAgbGV0IGRwID0gaWQucmVwbGFjZSgvLS9nLCAnXycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG4gICAgICBjYXJ2ZS5zZXQoY2hhaW4sIGRwLCBjaGFpbihpZCkpXG4gICAgfSlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxlY3Rpb25cbiJdfQ==