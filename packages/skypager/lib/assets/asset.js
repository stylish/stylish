'use strict';

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _collection = require('../collection');

var _collection2 = _interopRequireDefault(_collection);

var _path = require('path');

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EXTENSIONS = ['js', 'css', 'html'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var Asset = (function () {
  function Asset(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Asset);

    var asset = this;
    var raw = undefined;

    util.assign(this, {
      get raw() {
        return raw;
      },

      set raw(val) {
        raw = val;
        asset.contentDidChange(asset);
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

    this.id = this.paths.relative.replace(this.extension, '');
    this.slug = this.id.replace(/\//g, '__');

    Object.defineProperty(this, 'asts', {
      get: function get() {
        return asts;
      }
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
  }

  (0, _createClass3.default)(Asset, [{
    key: 'runImporter',
    value: function runImporter() {
      var importer = arguments.length <= 0 || arguments[0] === undefined ? 'disk' : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var callback = arguments[2];

      util.assign(options, { asset: this, project: this.project, collection: this.collection });
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
  }, {
    key: '__require',
    value: function __require() {
      if (this.requireable) {
        return require(this.uri);
      }
    }
  }, {
    key: 'loadWithWebpack',
    value: function loadWithWebpack() {
      var string = [this.loaderString, this.uri].join('!');
      return require(string);
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
    key: 'cacheKey',
    get: function get() {
      return [this.id, this.fingerprint.substr(0, 6)].join('-');
    }
  }, {
    key: 'cacheFilename',
    get: function get() {
      return [this.cacheKey, this.extension].join('');
    }
  }, {
    key: 'assetClass',
    get: function get() {
      return this.collection.AssetClass;
    }
  }, {
    key: 'assetGroup',
    get: function get() {
      return util.tabelize(this.assetClass.name);
    }
  }, {
    key: 'parentdir',
    get: function get() {
      return (0, _path.dirname)(this.dirname);
    }
  }, {
    key: 'dirname',
    get: function get() {
      return (0, _path.dirname)(this.uri);
    }
  }, {
    key: 'extension',
    get: function get() {
      return (0, _path.extname)(this.uri);
    }
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
    * Return any datasources which exist in a path
    * that is identically named to certain derivatives of ours
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
  }], [{
    key: 'createCollection',
    value: function createCollection(project) {
      var autoLoad = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var assetClass = this;
      var root = project.paths[util.tabelize(assetClass.name)];
      var collection = new _collection2.default(root, project, assetClass);

      return collection;
    }
  }, {
    key: 'groupName',
    get: function get() {
      return util.pluralize(this.typeAlias);
    }
  }, {
    key: 'typeAlias',
    get: function get() {
      return util.tabelize(this.name);
    }
  }]);
  return Asset;
})();

Asset.EXTENSIONS = EXTENSIONS;
Asset.GLOB = GLOB;

function relationshipProxy(asset) {
  var groups = ['assets', 'data_sources', 'documents', 'images', 'scripts', 'stylesheets', 'vectors'];

  var i = {
    get count() {
      return i.all.length;
    },
    get all() {
      return util.flatten(groups.map(function (group) {
        return i[group];
      }));
    }
  };

  var content = asset.project.content;

  groups.forEach(function (group) {
    var _util$assign, _mutatorMap;

    util.assign(i, (_util$assign = {}, _mutatorMap = {}, _mutatorMap[group] = _mutatorMap[group] || {}, _mutatorMap[group].get = function () {
      var related = content[group].relatedGlob(asset);
      return related.filter(function (a) {
        return a.paths.absolute != asset.paths.absolute;
      });
    }, (0, _defineEnumerableProperties3.default)(_util$assign, _mutatorMap), _util$assign));
  });

  return i;
}

exports = module.exports = Asset;