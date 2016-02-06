'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _util = require('./util');

var _path = require('path');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Collection = (function () {
  function Collection(root, project, assetClass) {
    (0, _classCallCheck3.default)(this, Collection);

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

  (0, _createClass3.default)(Collection, [{
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
        var payload = key ? (0, _defineProperty3.default)({}, a[key], asset) : asset;

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