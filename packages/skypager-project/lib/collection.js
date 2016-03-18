'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _assign2 = require('babel-runtime/core-js/object/assign');

var _assign3 = _interopRequireDefault(_assign2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _util = require('./util');

var _path = require('path');

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _result = require('lodash/result');

var _result2 = _interopRequireDefault(_result);

var _groupBy2 = require('lodash/groupBy');

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _invokeMap2 = require('lodash/invokeMap');

var _invokeMap3 = _interopRequireDefault(_invokeMap2);

var _mapValues2 = require('lodash/mapValues');

var _mapValues3 = _interopRequireDefault(_mapValues2);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _pickBy2 = require('lodash/pickBy');

var _pickBy3 = _interopRequireDefault(_pickBy2);

var _transform2 = require('lodash/transform');

var _transform3 = _interopRequireDefault(_transform2);

var _set = require('lodash/set');

var _set2 = _interopRequireDefault(_set);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

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

var carve = _set2.default;

var Collection = (function () {

  /**
  * Create a Collection for a subfolder of a Skypager Project.
  *
  * @param {Object} options
  * @param {Class} assetClass which type of assets are in this collection
  * @param {Project} project which project does this collection belong to
  * @param {String} root which folder is the root of the collection
  *
  */

  function Collection() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, Collection);
    var assetClass = options.assetClass;
    var project = options.project;
    var root = options.root;

    var collection = this;

    collection.root = root;

    if (options.exclude && typeof options.exclude === 'string') {
      options.exclude = [options.exclude];
    }

    if (options.include && typeof options.include === 'string') {
      options.include = [options.include];
    }

    (0, _util.defaults)(options, {
      autoLoad: false,
      include: [assetClass.GLOB],
      exclude: ['**/node_modules'],
      name: (0, _path.basename)(root)
    });

    collection.name = options.name || (0, _path.basename)(root);

    collection.hidden('project', project);
    collection.hidden('AssetClass', function () {
      return assetClass;
    });

    (0, _assign3.default)(this, (0, _pick2.default)(options, 'include', 'exclude', 'name', 'autoLoad'));

    var assets = {};
    var index = {};

    var loaded = false;

    collection.hidden('assets', function () {
      return assets;
    });
    collection.hidden('index', function () {
      return index;
    });

    // create a way of accessing a collections assets that matches the name of the collection
    if (assetClass.groupName && !collection[assetClass.groupName]) {
      collection.hidden((0, _util.tabelize)(assetClass.groupName), function () {
        return collection.assets;
      });
    }

    buildAtInterface(collection, false);

    if (options.autoLoad) {
      this.loadAssetsFromDisk();
    }
  }

  /**
   * Define a named query pattern for this collection.
   *
   * @param {String}
   *
   * @example
   *
   *    project.docs.scope('drafts', {status: 'draft'})
   *    project.docs.drafts
   */

  (0, _createClass3.default)(Collection, [{
    key: 'scope',
    value: function scope(scopeName, queryParams) {
      var _assign, _mutatorMap;

      var collection = this;

      if (collection.hasOwnProperty(scopeName)) {
        return collection;
      }

      if (typeof queryParams === 'function') {
        queryParams = attempt(queryParams);
      }

      assign(collection, (_assign = {}, _mutatorMap = {}, _mutatorMap[scopeName] = _mutatorMap[scopeName] || {}, _mutatorMap[scopeName].get = function () {
        try {
          return collection.where(queryParams || {});
        } catch (error) {
          return [error.message];
        }
      }, (0, _defineEnumerableProperties3.default)(_assign, _mutatorMap), _assign));

      return collection;
    }

    /**
     * Find assets which match the passed conditions.
     *
     * @param {Object,Function} params key/value pairs of attributes to match,
     *  or a function which returns true for a match
     *
     */

  }, {
    key: 'where',
    value: function where() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return wrapCollection(this, (0, _util.filterQuery)(this.all, params || {}));
    }

    /**
    *
    * @alias Collection#query
    */

  }, {
    key: 'query',
    value: function query() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this.where(params || {});
    }

    /**
     * Load assets into the collection. By default will load all files which match the include / exclude rules.
     *
     * This will get called automatically if the collection was created with autoLoad set to true.
     *
     * @param {Array} paths an array of paths relative to the collection root
     */

  }, {
    key: 'loadAssetsFromDisk',
    value: function loadAssetsFromDisk() {
      var _this = this;

      var paths = arguments.length <= 0 || arguments[0] === undefined ? this.filesInRoot : arguments[0];

      this._willLoadAssets(paths);

      paths.forEach(function (rel) {
        var asset = _this.createAsset(rel);
        _this.add(asset, true, true);
      });

      this._didLoadAssets(paths, false);
    }

    /**
    * Returns a unique list of group names for the assets in this collection
    *
    * Group names are usually the names of the direct subfolders of the collection root
    *
    * @return {Array}
    */

  }, {
    key: 'globFiles',

    /**
     * Returns a list of file paths within this collection's root folder.
     *
     * Will respect the collection's `include` and `exclude` options.
     *
     * @return {Array}
     */
    value: function globFiles() {
      var patterns = this.include;

      if (this.project.exists('.skypagerignore')) {
        /*patterns = patterns.concat(
          require('gitignore-globs')(this.project.join('.skypagerignore'), {
            negate: true
          })
        )*/
      } else {}

      /*patterns = patterns.concat(
        this.exclude.map(p => '!' + p)
      )*/

      patterns.push('!node_modules/');

      var results = require('glob-all').sync(patterns, {
        cwd: this.root
      });

      return results;
    }

    /**
     * Returns different paths for this collection.
     *
     * @example
     *
     *   project.root // => /Users/jonathan/Skypager/example
     *   project.docs.root // => /Users/jonathan/Skypager/example/docs
     *   project.docs.paths.absolute // => /User/jonathan/Skypager/example/docs
     *   project.docs.paths.relative // => docs
     */

  }, {
    key: 'makeGlobRegex',

    /**
    * Utility function to create a RegExp for a given glob pattern
    *
    * @param {String} pattern a glob pattern to pass to minimatch
    *
    * @return {RegExp}
    */
    value: function makeGlobRegex(pattern) {
      return _minimatch2.default.makeRe(pattern);
    }

    /**
    * RegExp patterns for each of this collections include patterns
    *
    * @return {Array, RegExp}
    */

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

    /**
     * Returns a pattern than can be used to match any assets related to
     * the target asset.
     *
     * @param {Asset} target an asset which might have related assets in this collection
     *
     * @return {Array}
     */
    value: function relatedGlob(target) {
      var _this2 = this;

      var patterns = [target.id + '.{' + this.AssetClass.EXTENSIONS.join(',') + '}', target.id + '/**/*.{' + this.AssetClass.EXTENSIONS.join(',') + '}'];

      return patterns.reduce(function (m, a) {
        return m.concat(_this2.glob(a));
      }, []);
    }

    /**
     * Pick attributes from each of the assets
     */

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

      return _transform3.default.apply(undefined, [this.assets].concat(args));
    }
  }, {
    key: 'mapValues',
    value: function mapValues() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _mapValues3.default.apply(undefined, [this.assets].concat(args));
    }
  }, {
    key: 'pickBy',
    value: function pickBy() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _pickBy3.default.apply(undefined, [this.assets].concat(args));
    }
  }, {
    key: 'groupBy',
    value: function groupBy() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      return _groupBy3.default.apply(undefined, [this.all].concat(args));
    }
  }, {
    key: 'invokeMap',
    value: function invokeMap() {
      for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }

      return _invokeMap3.default.apply(undefined, [this.all].concat(args));
    }
  }, {
    key: 'pluck',
    value: function pluck(prop) {
      return this.all.map(function (asset) {
        return (0, _result2.default)(asset, prop);
      });
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

      try {
        this.index[asset.paths.relative] = asset.id;
        this.index[asset.paths.absolute] = asset.id;
        this.index[asset.id] = asset.id;
        this.assets[asset.id] = asset;

        if (autoLoad) {
          asset.runImporter();
        }

        // expand the dot path when a collection is already loaded and a new asset is added
        if (expandDotPath) {
          //carve(this.at, asset.idPath, asset)
        }
      } catch (error) {
        console.log('Error adding asset', error.message);
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
        buildAtInterface(this, true);
      }
    }
  }, {
    key: '_willLoadAssets',
    value: function _willLoadAssets(paths) {}
  }, {
    key: 'at',
    value: function at(assetId) {
      var pointer = this.index[assetId];
      return this.assets[pointer];
    }
  }, {
    key: 'groupNames',
    get: function get() {
      return this.pluck('groupName').unique();
    }

    /**
     * Returns an object whose keys are the asset group name, and value
     * is an array of the asset ids which belong to that group.
     *
     * @return {Object}
     */

  }, {
    key: 'idsByGroupName',
    get: function get() {
      var grouped = this.groupBy('groupName');

      return (0, _keys2.default)(grouped).reduce(function (memo, group) {
        memo[group] = grouped[group].pluck('id');
        return memo;
      }, {});
    }

    /**
     * Returns a unique list of the asset categories in this collection.
     *
     * @return {Array}
     */

  }, {
    key: 'categories',
    get: function get() {
      return this.pluck('categoryFolder').unique();
    }

    /**
     * Returns an object whose keys are the asset category, and value
     * is an array of the asset ids which belong to that category.
     *
     * @return {Object}
     */

  }, {
    key: 'idsByCategory',
    get: function get() {
      var grouped = this.groupBy('categoryFolder');

      return (0, _keys2.default)(grouped).reduce(function (memo, group) {
        memo[group] = grouped[group].pluck('id');
        return memo;
      }, {});
    }

    /**
     * Returns all of the assets which are indexes in their folder.
     *
     * This is useful for example when you want to get all of javascript files which are
     * the main entry points for a particular component.
     *
     * @example
     *
     *    project.scripts.query(asset => asset.isIndex && asset.categoryFolder === 'components')
     *
     * @return {Array}
     */

  }, {
    key: 'indexes',
    get: function get() {
      return this.filter(function (asset) {
        return asset.isIndex;
      });
    }

    /**
     * The asset type alias for this collection's Asset Class name.
     *
     * @example
     *
     *    project.docs.assetType // => 'document'
     *
     * @return {String}
     */

  }, {
    key: 'assetType',
    get: function get() {
      return this.AssetClass.typeAlias;
    }

    /**
     * A pluralized version of this collection's Asset Class name
     *
     * @return {String}
     */

  }, {
    key: 'assetGroupName',
    get: function get() {
      return this.AssetClass.groupName;
    }

    /**
     * A getter that returns all of the files within this collection's root folder.
     *
     * @see globFiles
     *
     * @return {Array}
     *
     */

  }, {
    key: 'filesInRoot',
    get: function get() {
      return this.globFiles();
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
    key: 'includeRegexes',
    get: function get() {
      return this.include.map(function (pattern) {
        return _minimatch2.default.makeRe(pattern);
      });
    }

    /**
    * RegExp patterns for each of this collections exclude patterns
    *
    * @return {Array, RegExp}
    */

  }, {
    key: 'excludeRegexes',
    get: function get() {
      return this.exclude.map(function (pattern) {
        return _minimatch2.default.makeRe(pattern);
      });
    }
  }, {
    key: 'assetPaths',
    get: function get() {
      return this.all.map(function (a) {
        return a.uri;
      });
    }
  }, {
    key: 'all',
    get: function get() {
      return (0, _util.values)(this.assets);
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

exports.default = Collection;
function buildAtInterface(collection) {
  var expand = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  if (expand) {
    var expanded = collection.available.map(function (assetId) {
      return assetId.split('/');
    }).sort(function (a, b) {
      return a.length > b.length;
    }).map(function (id) {
      return id.join('/');
    });

    expanded.forEach(function (id) {
      var dp = id.replace(/-/g, '_').replace(/\//g, '.');
      carve(collection.at, dp, collection.at(id));
    });
  }
}

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
          carve(memo, a.id.replace(/\//g, '.'), asset);
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

  defineProperty(array, 'first', {
    enumerable: false,
    get: function get() {
      return array[0];
    }
  });

  defineProperty(array, 'last', {
    enumerable: false,
    get: function get() {
      return array[array.length - 1];
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

  defineProperty(array, 'groupBy', {
    enumerable: false,
    value: function value() {
      for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        args[_key11] = arguments[_key11];
      }

      return _groupBy3.default.apply(undefined, [array].concat(args));
    }
  });

  return array;
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var defineProperty = _Object.defineProperty;

function attempt(fn, onError) {
  try {
    return fn();
  } catch (error) {
    return typeof onError === 'function' ? onError(error) : false;
  }
}