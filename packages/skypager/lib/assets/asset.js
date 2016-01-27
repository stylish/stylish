'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EXTENSIONS = ['js', 'css', 'html'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var Asset = (function () {
  function Asset(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Asset);

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

  _createClass(Asset, [{
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
    key: 'require',
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
        return require(this.uri);
      }
    })
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
    }, _defineEnumerableProperties(_util$assign, _mutatorMap), _util$assign));
  });

  return i;
}

exports = module.exports = Asset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvYXNzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLWSxJQUFJOzs7Ozs7Ozs7O0FBRWhCLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUN4QyxJQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7O0lBRTVDLEtBQUs7QUFDVCxXQURJLEtBQUssQ0FDSSxHQUFHLEVBQWdCOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQixLQUFLOztBQUVQLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLEdBQUcsWUFBQSxDQUFBOztBQUVQLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksR0FBRyxHQUFJO0FBQUUsZUFBTyxHQUFHLENBQUE7T0FBRTs7QUFFekIsVUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFO0FBQ1osV0FBRyxHQUFHLEdBQUcsQ0FBQTtBQUNULGFBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5QjtLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMvQixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTthQUFNLE9BQU8sQ0FBQyxPQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQzdDLFFBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2FBQU0sT0FBTyxDQUFDLFVBQVU7S0FBQSxDQUFDLENBQUE7O0FBRW5ELFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFD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QUMsQ0FBQyxLQUFLLENBQUM7T0FBQSxDQUFDLENBQUMsQ0FBQTtLQUNuRDtHQUNGLENBQUE7O0FBRUQsTUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUE7O0FBRW5DLFFBQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7OztBQUN0QixRQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsb0RBQ04sS0FBSyxnQkFBTCxLQUFLLHFCQUFMLEtBQUssb0JBQUs7QUFDYixVQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQy9DLGFBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVE7T0FBQSxDQUFDLENBQUE7S0FDckUsd0VBQ0QsQ0FBQTtHQUNILENBQUMsQ0FBQTs7QUFFRixTQUFPLENBQUMsQ0FBQTtDQUNUOztBQUVELE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQSIsImZpbGUiOiJhc3NldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTa3lwYWdlciBmcm9tICcuLi9pbmRleCdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4uL2NvbGxlY3Rpb24nXG5cbmltcG9ydCB7IGV4dG5hbWUsIGRpcm5hbWUsIGpvaW4gfSBmcm9tICdwYXRoJ1xuaW1wb3J0IG1kNSBmcm9tICdtZDUnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ2pzJywgJ2NzcycsICdodG1sJ11cbmNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbmNsYXNzIEFzc2V0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGFzc2V0ID0gdGhpc1xuICAgIGxldCByYXdcblxuICAgIHV0aWwuYXNzaWduKHRoaXMsIHtcbiAgICAgIGdldCByYXcgKCkgeyByZXR1cm4gcmF3IH0sXG5cbiAgICAgIHNldCByYXcgKHZhbCkge1xuICAgICAgICByYXcgPSB2YWxcbiAgICAgICAgYXNzZXQuY29udGVudERpZENoYW5nZShhc3NldClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5oaWRkZW4oJ3VyaScsIHVyaSlcbiAgICB0aGlzLmhpZGRlbignb3B0aW9ucycsIG9wdGlvbnMpXG4gICAgdGhpcy5oaWRkZW4oJ3Byb2plY3QnLCAoKSA9PiBvcHRpb25zLnByb2plY3QpXG4gICAgdGhpcy5oaWRkZW4oJ2NvbGxlY3Rpb24nLCAoKSA9PiBvcHRpb25zLmNvbGxlY3Rpb24pXG5cbiAgICB0aGlzLmlkID0gdGhpcy5wYXRocy5yZWxhdGl2ZS5yZXBsYWNlKHRoaXMuZXh0ZW5zaW9uLCAnJylcbiAgICB0aGlzLnNsdWcgPSB0aGlzLmlkLnJlcGxhY2UoL1xcLy9nLCdfXycpXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2FzdHMnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFzdHNcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5sYXp5KCdwYXJzZWQnLCAoKSA9PiB0aGlzLnBhcnNlKHRoaXMucmF3KSlcbiAgICB0aGlzLmxhenkoJ2luZGV4ZWQnLCAoKSA9PiB0aGlzLmluZGV4KHRoaXMucGFyc2VkLCB0aGlzKSlcbiAgICB0aGlzLmxhenkoJ3RyYW5zZm9ybWVkJywgKCkgPT4gdGhpcy50cmFuc2Zvcm0odGhpcy5pbmRleGVkLCB0aGlzKSlcbiAgfVxuXG4gIHJ1bkltcG9ydGVyKGltcG9ydGVyID0gJ2Rpc2snLCBvcHRpb25zID0ge30sIGNhbGxiYWNrKXtcbiAgICB1dGlsLmFzc2lnbihvcHRpb25zLCB7YXNzZXQ6IHRoaXMsIHByb2plY3Q6IHRoaXMucHJvamVjdCwgY29sbGVjdGlvbjogdGhpcy5jb2xsZWN0aW9ufSlcbiAgICB0aGlzLnByb2plY3QucnVuLmltcG9ydGVyKGltcG9ydGVyLCBvcHRpb25zLCBjYWxsYmFjayB8fCB0aGlzLmFzc2V0V2FzSW1wb3J0ZWQuYmluZCh0aGlzKSlcbiAgfVxuXG4gIGdldCBmaW5nZXJwcmludCAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF3ICYmIG1kNSh0aGlzLnJhdylcbiAgfVxuXG4gIGdldCBpZFBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLmlkLnJlcGxhY2UoLy0vZywgJ18nKS5yZXBsYWNlKC9cXC8vZywgJy4nKVxuICB9XG5cbiAgZW5zdXJlSW5kZXhlcyAoKSB7XG4gICAgbGV0IGFzc2V0ID0gdGhpc1xuXG4gICAgaWYgKCFhc3NldC5wYXJzZWQpIHsgYXNzZXQucGFyc2VkID0gYXNzZXQucGFyc2UoYXNzZXQucmF3LCBhc3NldCkgfVxuICAgIGlmICghYXNzZXQuaW5kZXhlZCkgeyBhc3NldC5pbmRleGVkID0gYXNzZXQuaW5kZXgoYXNzZXQucGFyc2VkLCBhc3NldCkgfVxuXG4gICAgcmV0dXJuIGFzc2V0LmluZGV4ZWRcbiAgfVxuXG4gIHBhcnNlICgpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZXIgJiYgdGhpcy5wYXJzZXIodGhpcy5yYXcsIHRoaXMpXG4gIH1cblxuICBpbmRleCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZXhlciAmJiB0aGlzLmluZGV4ZXIodGhpcy5wYXJzZWQsIHRoaXMpXG4gIH1cblxuICB0cmFuc2Zvcm0gKCkge1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVyICYmIHRoaXMudHJhbnNmb3JtZXIodGhpcy5pbmRleGVkLCB0aGlzKVxuICB9XG5cbiAgZ2V0IGNhY2hlS2V5ICgpIHtcbiAgICByZXR1cm4gW3RoaXMuaWQsIHRoaXMuZmluZ2VycHJpbnQuc3Vic3RyKDAsIDYpXS5qb2luKCctJylcbiAgfVxuXG4gIGdldCBjYWNoZUZpbGVuYW1lICgpIHtcbiAgICByZXR1cm4gW3RoaXMuY2FjaGVLZXksIHRoaXMuZXh0ZW5zaW9uXS5qb2luKCcnKVxuICB9XG5cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmhpZGRlbi5nZXR0ZXIodGhpcywgLi4uYXJncykgfVxuXG4gIGxhenkgKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwubGF6eSh0aGlzLCAuLi5hcmdzKSB9XG5cbiAgcmVuZGVyIChhc3QgPSAndHJhbnNmb3JtZWQnLCBvcHRpb25zID0ge30pIHtcblxuICB9XG5cbiAgYXNzZXRXYXNJbXBvcnRlZCAoKSB7XG5cbiAgfVxuXG4gIGFzc2V0V2FzUHJvY2Vzc2VkICgpIHtcblxuICB9XG5cbiAgY29udGVudFdpbGxDaGFuZ2UgKG9sZENvbnRlbnQsIG5ld0NvbnRlbnQpIHtcblxuICB9XG5cbiAgY29udGVudERpZENoYW5nZSAoYXNzZXQpIHtcblxuICB9XG5cbiAgZ2V0IGFzc2V0Q2xhc3MgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uQXNzZXRDbGFzc1xuICB9XG5cbiAgZ2V0IGFzc2V0R3JvdXAgKCkge1xuICAgIHJldHVybiB1dGlsLnRhYmVsaXplKHRoaXMuYXNzZXRDbGFzcy5uYW1lKVxuICB9XG5cbiAgZ2V0IHBhcmVudGRpciAoKSB7XG4gICAgcmV0dXJuIGRpcm5hbWUodGhpcy5kaXJuYW1lKVxuICB9XG5cbiAgZ2V0IGRpcm5hbWUgKCkge1xuICAgIHJldHVybiBkaXJuYW1lKHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0IGV4dGVuc2lvbiAoKSB7XG4gICAgcmV0dXJuIGV4dG5hbWUodGhpcy51cmkpXG4gIH1cblxuICBnZXQgcGF0aHMgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICAvLyByZWxhdGl2ZSB0byB0aGUgY29sbGVjdGlvbiByb290XG4gICAgICBnZXQgcmVsYXRpdmUgKCkge1xuICAgICAgICByZXR1cm4gYXNzZXQudXJpLnJlcGxhY2UoL15cXC8vLCAnJylcbiAgICAgIH0sXG4gICAgICAvLyByZWxhdGl2ZSB0byB0aGUgcHJvamVjdCByb290XG4gICAgICBnZXQgcHJvamVjdCAoKSB7XG4gICAgICAgIHJldHVybiBqb2luKGFzc2V0LmNvbGxlY3Rpb24ucm9vdCwgYXNzZXQudXJpLnJlcGxhY2UoL15cXC8vLCAnJykpLnJlcGxhY2UoYXNzZXQucHJvamVjdC5yb290ICsgJy8nLCAnJylcbiAgICAgIH0sXG4gICAgICBnZXQgcHJvamVjdFJlcXVpcmUgKCkge1xuICAgICAgICByZXR1cm4gam9pbihhc3NldC5jb2xsZWN0aW9uLnJvb3QsIGFzc2V0LnVyaS5yZXBsYWNlKC9eXFwvLywgJycpKS5yZXBsYWNlKGFzc2V0LnByb2plY3Qucm9vdCArICcvJywgJycpXG4gICAgICB9LFxuICAgICAgZ2V0IGFic29sdXRlICgpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4oYXNzZXQuY29sbGVjdGlvbi5yb290LCBhc3NldC51cmkucmVwbGFjZSgvXlxcLy8sICcnKSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBSZXR1cm4gYW55IGRhdGFzb3VyY2VzIHdoaWNoIGV4aXN0IGluIGEgcGF0aFxuICAqIHRoYXQgaXMgaWRlbnRpY2FsbHkgbmFtZWQgdG8gY2VydGFpbiBkZXJpdmF0aXZlcyBvZiBvdXJzXG4gICovXG5cbiAgZ2V0IHJlbGF0ZWQgKCkge1xuICAgIHJldHVybiByZWxhdGlvbnNoaXBQcm94eSh0aGlzKVxuICB9XG5cbiAgcmVxdWlyZSAoKSB7XG4gICAgaWYgKHRoaXMucmVxdWlyZWFibGUpIHsgcmV0dXJuIHJlcXVpcmUodGhpcy51cmkpIH1cbiAgfVxuXG4gIGdldCByZXF1aXJlYWJsZSAoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiAocmVxdWlyZS5leHRlbnNpb25zW3RoaXMuZXh0ZW5zaW9uXSkgPT09ICdmdW5jdGlvbidcbiAgfVxuXG4gIGdldCBleHRlbnNpb24gKCkge1xuICAgIHJldHVybiBleHRuYW1lKHRoaXMudXJpKVxuICB9XG5cbiAgbG9hZFdpdGhXZWJwYWNrICgpIHtcbiAgICBsZXQgc3RyaW5nID0gW3RoaXMubG9hZGVyU3RyaW5nLCB0aGlzLnVyaV0uam9pbignIScpXG4gICAgcmV0dXJuIHJlcXVpcmUoc3RyaW5nKVxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUNvbGxlY3Rpb24gKHByb2plY3QsIGF1dG9Mb2FkID0gZmFsc2UpIHtcbiAgICBsZXQgYXNzZXRDbGFzcyA9IHRoaXNcbiAgICBsZXQgcm9vdCA9IHByb2plY3QucGF0aHNbdXRpbC50YWJlbGl6ZShhc3NldENsYXNzLm5hbWUpXVxuICAgIGxldCBjb2xsZWN0aW9uID0gbmV3IENvbGxlY3Rpb24ocm9vdCwgcHJvamVjdCwgYXNzZXRDbGFzcylcblxuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb25cbiAgfVxuXG4gIHN0YXRpYyBnZXQgZ3JvdXBOYW1lICgpIHtcbiAgICByZXR1cm4gdXRpbC5wbHVyYWxpemUodGhpcy50eXBlQWxpYXMpXG4gIH1cblxuICBzdGF0aWMgZ2V0IHR5cGVBbGlhcyAoKSB7XG4gICAgcmV0dXJuIHV0aWwudGFiZWxpemUodGhpcy5uYW1lKVxuICB9XG59XG5cbkFzc2V0LkVYVEVOU0lPTlMgPSBFWFRFTlNJT05TXG5Bc3NldC5HTE9CID0gR0xPQlxuXG5mdW5jdGlvbiByZWxhdGlvbnNoaXBQcm94eSAoYXNzZXQpIHtcbiAgY29uc3QgZ3JvdXBzID0gWydhc3NldHMnLCAnZGF0YV9zb3VyY2VzJywgJ2RvY3VtZW50cycsICdpbWFnZXMnLCAnc2NyaXB0cycsICdzdHlsZXNoZWV0cycsICd2ZWN0b3JzJ11cblxuICBsZXQgaSA9IHtcbiAgICBnZXQgY291bnQoKXtcbiAgICAgIHJldHVybiBpLmFsbC5sZW5ndGhcbiAgICB9LFxuICAgIGdldCBhbGwoKXtcbiAgICAgIHJldHVybiB1dGlsLmZsYXR0ZW4oZ3JvdXBzLm1hcChncm91cCA9PiBpW2dyb3VwXSkpXG4gICAgfVxuICB9XG5cbiAgbGV0IGNvbnRlbnQgPSBhc3NldC5wcm9qZWN0LmNvbnRlbnRcblxuICBncm91cHMuZm9yRWFjaChncm91cCA9PiB7XG4gICAgdXRpbC5hc3NpZ24oaSwge1xuICAgICAgZ2V0IFtncm91cF0gKCkge1xuICAgICAgICBsZXQgcmVsYXRlZCA9IGNvbnRlbnRbZ3JvdXBdLnJlbGF0ZWRHbG9iKGFzc2V0KVxuICAgICAgICByZXR1cm4gcmVsYXRlZC5maWx0ZXIoYSA9PiBhLnBhdGhzLmFic29sdXRlICE9IGFzc2V0LnBhdGhzLmFic29sdXRlKVxuICAgICAgfVxuICAgIH0pXG4gIH0pXG5cbiAgcmV0dXJuIGlcbn1cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gQXNzZXRcbiJdfQ==