'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('./util');

var _path = require('path');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The Skypager.Collection is a wrapper around local file folders
 * which is responsible for assigning different types of Asset Classes
 * to handle different types of source files in the project, which are used to parse,
 * index, and transform these files so that they can be manipulated programmatically
 * loaded into a collection, they can easily be searched, queried, aggregated, related,
 * or whatever.
 *
 * Collections work through simple file extensions and folder naming conventions,
 * however they can be configured to use different patterns and paths to suit your liking.
 */

var Collection = (function () {
  function Collection() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Collection);
    var root = options.root;
    var project = options.project;
    var assetClass = options.assetClass;

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
    collection.hidden('assetPattern', function () {
      return options.pattern || assetClass.GLOB;
    });
    collection.hidden('excludePattern', function () {
      return options.ignore || '**/node_modules';
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
    key: 'globFiles',
    value: function globFiles(pattern) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var glob = require('glob');

      return new _promise2.default(function (resolve, reject) {
        glob(pattern, (0, _extends3.default)({ cwd: _this.root }, options), function (err, files) {
          if (err) {
            reject(err);
            return;
          } else {
            resolve(files);
          }
        });
      });
    }
  }, {
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
    key: 'mapPick',
    value: function mapPick() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.map(function (asset) {
        return asset.pick.apply(asset, args);
      });
    }
  }, {
    key: 'mapResult',
    value: function mapResult() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return this.map(function (asset) {
        return asset.result.apply(asset, args);
      });
    }
  }, {
    key: 'transform',
    value: function transform() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _lodash.transform.apply(undefined, [this.assets].concat(args));
    }
  }, {
    key: 'mapValues',
    value: function mapValues() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _lodash.mapValues.apply(undefined, [this.assets].concat(args));
    }
  }, {
    key: 'groupBy',
    value: function groupBy() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _lodash.groupBy.apply(undefined, [this.all].concat(args));
    }
  }, {
    key: 'invokeMap',
    value: function invokeMap() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _lodash.invokeMap.apply(undefined, [this.all].concat(args));
    }
  }, {
    key: 'invoke',
    value: function invoke() {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return _lodash.invoke.apply(undefined, [this.all].concat(args));
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
    key: 'createAsset',
    value: function createAsset(relativePath) {
      return new this.AssetClass(relativePath, {
        collection: this,
        project: this.project
      });
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
        (0, _lodash.set)(this.at, asset.idPath, asset);
      }
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }

      return _util.hidden.getter.apply(_util.hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
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
    key: 'assetType',
    get: function get() {
      return this.AssetClass.typeAlias;
    }
  }, {
    key: 'assetGroupName',
    get: function get() {
      return this.AssetClass.groupName;
    }
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
      (0, _lodash.set)(chain, dp, chain(id));
    });
  }
}

module.exports = Collection;

function wrapCollection(collection, array) {
  defineProperty(array, 'condense', {
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

        if (key === 'idpath') {
          (0, _lodash.set)(memo, a.id.replace(/\//g, '.'), asset);
          return memo;
        }

        var payload = key ? (0, _defineProperty3.default)({}, a[key], asset) : asset;

        return assign(memo, payload);
      }, {});
    }
  });

  defineProperty(array, 'merge', {
    enumerable: false,
    value: function merge() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return array.condense({ key: false, prop: options.prop || 'data' });
    }
  });

  defineProperty(array, 'mapPick', {
    enumerable: false,
    value: function value() {
      for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }

      return array.map(function (asset) {
        return asset.pick.apply(asset, args);
      });
    }
  });

  return array;
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var defineProperty = _Object.defineProperty;