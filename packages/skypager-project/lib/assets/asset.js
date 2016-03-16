'use strict';

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _class, _temp; /**
                    * The Skypager.Asset is an abstract container representing a single file
                    * of a specific type (e.g. javascript, markdown, css).
                    *
                    * Assets have a `uri` property which is either a file system path or URL on a remote server.
                    *
                    * Assets provide metadata about files, and a mechanism for determining relationships between
                    * other files in the project.
                    *
                    * Asset classes define a `parse`, `index`, and `transform` interface that can delegate
                    * to different libraries that provide us with access to an AST for the given type of file.
                    *
                    * For example `mdast` or `remark` for markdown, babel for javascript, cheerio for html and svg.
                    *
                    * The main goal behind having access to the ASTs of different files is extracting entities
                    * and references from the Asset for the purposes of building applications which allow for
                    * programatic manipulation of groups of related assets.
                    *
                    */

var _path = require('path');

var _util = require('../util');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

var _result2 = require('lodash/result');

var _result3 = _interopRequireDefault(_result2);

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['js', 'css', 'html'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

module.exports = (_temp = _class = (function () {
  (0, _createClass3.default)(Asset, null, [{
    key: 'createCollection',

    /**
     * Create a collection of Assets for this particular class.
     *
     * @see Skypager.Collection
     *
     * @param {Project} project which project does this collection belong to
     * @param {Object} options options for the collection
     */
    value: function createCollection(project) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var assetClass = this;
      var root = options.root || project.paths[(0, _util.tableize)(assetClass.name)];

      return new _collection2.default((0, _extends3.default)({
        root: root,
        project: project,
        assetClass: assetClass
      }, options));
    }

    /**
     * @private
     *
     * Create an asset for a given uri. This will usually be handled automatically
     * by the collection or project.
     *
     * @param {String} uri A URI or file system path which can access the file
     * @param {Object} options
     */

  }]);

  function Asset(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Asset);

    var asset = this;
    var collection = options.collection;
    var project = options.project;

    var raw = options.raw || options.contents;

    (0, _invariant2.default)(uri, 'Must specify a URI for an asset');
    (0, _invariant2.default)(collection, 'Must specify the collection this asset belongs to');

    if (!project) {
      project = collection.project;
    }

    defineProperties(this, {
      raw: {
        enumerable: false,
        get: function get() {
          return raw;
        },
        set: function set(val) {
          var oldVal = raw;raw = val;asset.contentDidChange(raw, oldVal);
        }
      }
    });

    this.hidden('uri', uri);
    this.hidden('options', options);
    this.hidden('project', function () {
      return options.project;
    });
    this.hidden('collection', function () {
      return options.collection;
    });

    this.id = this.generateId();

    this.hidden('slug', function () {
      return _this.id.replace(/\//g, '__');
    });

    this.lazy('parsed', function () {
      return _this.parse(_this.raw);
    });
    this.lazy('indexed', function () {
      return _this.index(_this.parsed, _this);
    });
    this.lazy('transformed', function () {
      return _this.transform(_this.indexed, _this);
    });
    this.lazy('data', this.getData, true);
  }

  (0, _createClass3.default)(Asset, [{
    key: 'getData',
    value: function getData() {
      return this.frontmatter || {};
    }
  }, {
    key: 'generateId',
    value: function generateId() {
      return this.paths.relative.replace(this.extension, '');
    }
  }, {
    key: 'templater',
    value: function templater(string) {
      var asset = this;
      var project = asset.project;

      var accessibleEnvVars = project.vault.templates.accessibleEnvVars;

      return (0, _util.template)(string, {
        imports: {
          get project() {
            return asset.project;
          },
          get settings() {
            return asset.project && asset.project.settings;
          },
          get collection() {
            return asset.collection;
          },
          get self() {
            return asset;
          },
          get process() {
            return {
              env: _pick3.default.apply(undefined, [process.env].concat((0, _toConsumableArray3.default)(accessibleEnvVars)))
            };
          },
          get env() {
            return _pick3.default.apply(undefined, [process.env].concat((0, _toConsumableArray3.default)(accessibleEnvVars)));
          }
        }
      });
    }
  }, {
    key: 'pick',
    value: function pick() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _pick3.default.apply(undefined, [this].concat(args));
    }
  }, {
    key: 'get',
    value: function get() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _result3.default.apply(undefined, [this].concat(args));
    }
  }, {
    key: 'result',
    value: function result() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _result3.default.apply(undefined, [this].concat(args));
    }
  }, {
    key: 'runImporter',
    value: function runImporter() {
      var importer = arguments.length <= 0 || arguments[0] === undefined ? 'disk' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var callback = arguments[2];

      (0, _util.assign)(options, { asset: this, project: this.project, collection: this.collection });
      this.project.run.importer(importer, options, callback || this.assetWasImported.bind(this));
    }
  }, {
    key: 'ensureIndexes',
    value: function ensureIndexes() {
      var asset = this;

      if (!asset.parsed) {
        asset.parsed = asset.parse(asset.raw, asset);
      }
      if (!asset.indexed) {
        asset.indexed = asset.index(asset.parsed, asset);
      }

      return asset.indexed;
    }
  }, {
    key: 'parse',
    value: function parse() {
      return this.parser && this.parser(this.raw, this);
    }
  }, {
    key: 'index',
    value: function index() {
      return this.indexer && this.indexer(this.parsed, this);
    }
  }, {
    key: 'transform',
    value: function transform() {
      return this.transformer && this.transformer(this.indexed, this);
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _util.hidden.getter.apply(_util.hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _util.lazy.apply(undefined, [this].concat(args));
    }
  }, {
    key: 'render',
    value: function render() {
      var ast = arguments.length <= 0 || arguments[0] === undefined ? 'transformed' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    }
  }, {
    key: 'assetWasImported',
    value: function assetWasImported() {}
  }, {
    key: 'assetWasProcessed',
    value: function assetWasProcessed() {}
  }, {
    key: 'contentWillChange',
    value: function contentWillChange(oldContent, newContent) {}
  }, {
    key: 'contentDidChange',
    value: function contentDidChange(asset) {}

    /**
     * The groupName of an asset is the name of the folder it belongs to
     * inside of the collection.
     *
     * @example the scripts collection found at <projectRoot>/src
     *
     *    Given the following folder structure:
     *
     *    - src/
     *      - components/
     *        - TableView/
     *          - index.js
     *      - screens/
     *        - HomePage/
     *          - index.js
     *
     *    The asset components/TableView has a groupName of "components"
     *
     *    The asset screens/HomePage has a groupName of "screens"
     */

  }, {
    key: 'require',

    /**
    * Require this asset by its absolute path.
    */
    value: (function (_require) {
      function require() {
        return _require.apply(this, arguments);
      }

      require.toString = function () {
        return _require.toString();
      };

      return require;
    })(function () {
      if (this.requireable) {
        return require(this.paths.absolute);
      }
    })

    /**
     * can this asset be natively required? checks require.extensions
     *
     * @return {Boolean}
     */

  }, {
    key: 'save',

    /**
    *
    * @param {Boolean} options.allowEmpty
    *
    * Save this asset by flushing the raw contents
    * of the asset to disk.  If there is no raw content, or if it is
    * zero length, you must pass a truthy value for allowEmpty
    *
    * @return {Promise}
    *
    */
    value: function save() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.raw || this.raw.length === 0) {
        if (!options.allowEmpty) {
          return false;
        }
      }

      return require('fs-promise').writeFile(this.paths.absolute, this.raw, 'utf8');
    }

    /**
     * Synchronously save this asset by flushing the raw contents
     * of the asset to disk.  If there is no raw content, or if it is
     * zero length, you must pass a truthy value for allowEmpty
     *
     * @param {Boolean} options.allowEmpty
     */

  }, {
    key: 'saveSync',
    value: function saveSync() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.raw || this.raw.length === 0) {
        if (!options.allowEmpty) {
          return false;
        }
      }

      return require('fs').writeFileSync(this.paths.absolute, this.raw, 'utf8');
    }
  }, {
    key: 'metadata',
    get: function get() {
      return this.frontmatter;
    }
  }, {
    key: 'frontmatter',
    get: function get() {
      return {};
    }
  }, {
    key: 'fingerprint',
    get: function get() {
      return this.raw && (0, _md2.default)(this.raw);
    }
  }, {
    key: 'idPath',
    get: function get() {
      return this.id.replace(/-/g, '_').replace(/\//g, '.');
    }
  }, {
    key: 'modelClass',
    get: function get() {
      return this.project.resolve.model(this);
    }
  }, {
    key: 'modelDefiniton',
    get: function get() {
      return this.modelClass && this.modelClass.definition;
    }
  }, {
    key: 'cacheKey',
    get: function get() {
      return [this.id, this.fingerprint.substr(0, 6)].join('-');
    }

    /**
     * Return the name of a file that can be used to store information for this file
     * in the project cache directory.
     */

  }, {
    key: 'cacheFilename',
    get: function get() {
      return [this.cacheKey, this.extension].join('');
    }
  }, {
    key: 'groupName',
    get: function get() {
      return this.id == 'index' ? this.collection.name : (0, _util.pluralize)(this.paths.relative.split('/')[0]);
    }

    /**
     * A singularized version of Asset#groupName
     *
     */

  }, {
    key: 'type',
    get: function get() {
      return (0, _util.singularize)(this.paths.relative.split('/')[0]);
    }
  }, {
    key: 'assetClass',
    get: function get() {
      return this.collection.AssetClass;
    }
  }, {
    key: 'assetGroup',
    get: function get() {
      return (0, _util.tableize)(this.assetClass.name);
    }

    /**
     * If an asset belongs to a folder like components, layouts, etc.
     * then the categoryFolder would be components
     *
     * @return {String}
     */

  }, {
    key: 'category',
    get: function get() {
      if (this.id === 'index' || this.dirname === 'src') {
        return this.assetGroup;
      }

      var result = this.isIndex ? (0, _util.tableize)((0, _path.basename)((0, _path.dirname)(this.dirname))) : (0, _util.tableize)((0, _path.basename)(this.dirname));

      switch (result) {
        case 'srcs':
          return 'scripts';
        default:
          return result;
      }
    }

    /**
     * @alias Asset#category
     */

  }, {
    key: 'assetFamily',
    get: function get() {
      return this.categoryFolder;
    }

    /**
     * @alias Asset#category
     */

  }, {
    key: 'categoryFolder',
    get: function get() {
      return this.category;
    }

    /**
     * Returns the parent folder of this asset
     *
     * @return {String}
     */

  }, {
    key: 'parentdir',
    get: function get() {
      return (0, _path.dirname)(this.dirname);
    }

    /**
     * Returns the folder this asset belongs to
     *
     * @return {String}
     */

  }, {
    key: 'dirname',
    get: function get() {
      return (0, _path.dirname)(this.paths.absolute);
    }

    /**
     * Returns this assets extension
     *
     * @return {String}
     */

  }, {
    key: 'extension',
    get: function get() {
      return (0, _path.extname)(this.uri);
    }

    /**
     * Returns true if this asset is an index
     */

  }, {
    key: 'isIndex',
    get: function get() {
      return !!this.uri.match(/index\.\w+$/);
    }

    /**
     * How many folders deep is this asset inside of the collection
     *
     * @return {Number}
     */

  }, {
    key: 'depth',
    get: function get() {
      return this.id.split('/').length;
    }

    /**
     * Return different path values for this asset.
     *
     * - absolute,
     * - relative to collection,
     * - relative to the project
     *
     * @return {Object}
     */

  }, {
    key: 'paths',
    get: function get() {
      var asset = this;

      return {
        // relative to the collection root
        get relative() {
          return asset.uri.replace(/^\//, '');
        },
        // relative to the project root
        get project() {
          return (0, _path.join)(asset.collection.root, asset.uri.replace(/^\//, '')).replace(asset.project.root + '/', '');
        },
        get projectRequire() {
          return (0, _path.join)(asset.collection.root, asset.uri.replace(/^\//, '')).replace(asset.project.root + '/', '');
        },
        get absolute() {
          return (0, _path.join)(asset.collection.root, asset.uri.replace(/^\//, ''));
        }
      };
    }

    /**
     * Return an object which provides access to all assets related to this one.
    */

  }, {
    key: 'related',
    get: function get() {
      return relationshipProxy(this);
    }
  }, {
    key: 'requireable',
    get: function get() {
      return typeof require.extensions[this.extension] === 'function';
    }
  }]);
  return Asset;
})(), _class.EXTENSIONS = EXTENSIONS, _class.GLOB = GLOB, _temp);

function relationshipProxy(asset) {
  var groups = ['assets', 'data_sources', 'documents', 'images', 'scripts', 'packages', 'projects', 'settings_files', 'copy_files', 'stylesheets', 'vectors'];

  var i = {
    get count() {
      return i.all.length;
    },
    get all() {
      return (0, _util.flatten)(groups.map(function (group) {
        return i[group];
      }));
    }
  };

  var content = asset.project.content;

  groups.forEach(function (group) {
    var _assign, _mutatorMap;

    (0, _util.assign)(i, (_assign = {}, _mutatorMap = {}, _mutatorMap[group] = _mutatorMap[group] || {}, _mutatorMap[group].get = function () {
      var related = content[group].relatedGlob(asset);
      return related.filter(function (a) {
        return a.paths.absolute != asset.paths.absolute;
      });
    }, (0, _defineEnumerableProperties3.default)(_assign, _mutatorMap), _assign));
  });

  return i;
}

var _Object = Object;
var defineProperties = _Object.defineProperties;