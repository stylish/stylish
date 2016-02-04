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
    }, _defineEnumerableProperties(_util$assign, _mutatorMap), _util$assign));
  });

  return i;
}

exports = module.exports = Asset;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvYXNzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFLWSxJQUFJOzs7Ozs7Ozs7O0FBRWhCLElBQU0sVUFBVSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQTtBQUN4QyxJQUFNLElBQUksR0FBRyxRQUFRLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUE7O0lBRTVDLEtBQUs7QUFDVCxXQURJLEtBQUssQ0FDSSxHQUFHLEVBQWdCOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQixLQUFLOztBQUVQLFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLEdBQUcsWUFBQSxDQUFBOztBQUVQLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksR0FBRyxHQUFJO0FBQUUsZUFBTyxHQUFHLENBQUE7T0FBRTs7QUFFekIsVUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFO0FBQ1osV0FBRyxHQUFHLEdBQUcsQ0FBQTtBQUNULGFBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQTtPQUM5QjtLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMvQixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTthQUFNLE9BQU8sQ0FBQyxPQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQzdDLFFBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2FBQU0sT0FBTyxDQUFDLFVBQVU7S0FBQSxDQUFDLENBQUE7O0FBRW5ELFFBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFD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QUssQ0FBQztPQUFBLENBQUMsQ0FBQyxDQUFBO0tBQ25EO0dBQ0YsQ0FBQTs7QUFFRCxNQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQTs7QUFFbkMsUUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssRUFBSTs7O0FBQ3RCLFFBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxvREFDTixLQUFLLGdCQUFMLEtBQUsscUJBQUwsS0FBSyxvQkFBSztBQUNiLFVBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0MsYUFBTyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUEsQ0FBQztlQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUTtPQUFBLENBQUMsQ0FBQTtLQUNyRSx3RUFDRCxDQUFBO0dBQ0gsQ0FBQyxDQUFBOztBQUVGLFNBQU8sQ0FBQyxDQUFBO0NBQ1Q7O0FBRUQsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFBIiwiZmlsZSI6ImFzc2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4uL2luZGV4J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi4vY29sbGVjdGlvbidcblxuaW1wb3J0IHsgZXh0bmFtZSwgZGlybmFtZSwgam9pbiB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vdXRpbCdcblxuY29uc3QgRVhURU5TSU9OUyA9IFsnanMnLCAnY3NzJywgJ2h0bWwnXVxuY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuY2xhc3MgQXNzZXQge1xuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgbGV0IHJhd1xuXG4gICAgdXRpbC5hc3NpZ24odGhpcywge1xuICAgICAgZ2V0IHJhdyAoKSB7IHJldHVybiByYXcgfSxcblxuICAgICAgc2V0IHJhdyAodmFsKSB7XG4gICAgICAgIHJhdyA9IHZhbFxuICAgICAgICBhc3NldC5jb250ZW50RGlkQ2hhbmdlKGFzc2V0KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmhpZGRlbigndXJpJywgdXJpKVxuICAgIHRoaXMuaGlkZGVuKCdvcHRpb25zJywgb3B0aW9ucylcbiAgICB0aGlzLmhpZGRlbigncHJvamVjdCcsICgpID0+IG9wdGlvbnMucHJvamVjdClcbiAgICB0aGlzLmhpZGRlbignY29sbGVjdGlvbicsICgpID0+IG9wdGlvbnMuY29sbGVjdGlvbilcblxuICAgIHRoaXMuaWQgPSB0aGlzLnBhdGhzLnJlbGF0aXZlLnJlcGxhY2UodGhpcy5leHRlbnNpb24sICcnKVxuICAgIHRoaXMuc2x1ZyA9IHRoaXMuaWQucmVwbGFjZSgvXFwvL2csJ19fJylcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnYXN0cycsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXN0c1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmxhenkoJ3BhcnNlZCcsICgpID0+IHRoaXMucGFyc2UodGhpcy5yYXcpKVxuICAgIHRoaXMubGF6eSgnaW5kZXhlZCcsICgpID0+IHRoaXMuaW5kZXgodGhpcy5wYXJzZWQsIHRoaXMpKVxuICAgIHRoaXMubGF6eSgndHJhbnNmb3JtZWQnLCAoKSA9PiB0aGlzLnRyYW5zZm9ybSh0aGlzLmluZGV4ZWQsIHRoaXMpKVxuICB9XG5cbiAgcnVuSW1wb3J0ZXIoaW1wb3J0ZXIgPSAnZGlzaycsIG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spe1xuICAgIHV0aWwuYXNzaWduKG9wdGlvbnMsIHthc3NldDogdGhpcywgcHJvamVjdDogdGhpcy5wcm9qZWN0LCBjb2xsZWN0aW9uOiB0aGlzLmNvbGxlY3Rpb259KVxuICAgIHRoaXMucHJvamVjdC5ydW4uaW1wb3J0ZXIoaW1wb3J0ZXIsIG9wdGlvbnMsIGNhbGxiYWNrIHx8IHRoaXMuYXNzZXRXYXNJbXBvcnRlZC5iaW5kKHRoaXMpKVxuICB9XG5cbiAgZ2V0IGZpbmdlcnByaW50ICgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXcgJiYgbWQ1KHRoaXMucmF3KVxuICB9XG5cbiAgZ2V0IGlkUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQucmVwbGFjZSgvLS9nLCAnXycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG4gIH1cblxuICBlbnN1cmVJbmRleGVzICgpIHtcbiAgICBsZXQgYXNzZXQgPSB0aGlzXG5cbiAgICBpZiAoIWFzc2V0LnBhcnNlZCkgeyBhc3NldC5wYXJzZWQgPSBhc3NldC5wYXJzZShhc3NldC5yYXcsIGFzc2V0KSB9XG4gICAgaWYgKCFhc3NldC5pbmRleGVkKSB7IGFzc2V0LmluZGV4ZWQgPSBhc3NldC5pbmRleChhc3NldC5wYXJzZWQsIGFzc2V0KSB9XG5cbiAgICByZXR1cm4gYXNzZXQuaW5kZXhlZFxuICB9XG5cbiAgcGFyc2UgKCkge1xuICAgIHJldHVybiB0aGlzLnBhcnNlciAmJiB0aGlzLnBhcnNlcih0aGlzLnJhdywgdGhpcylcbiAgfVxuXG4gIGluZGV4ICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleGVyICYmIHRoaXMuaW5kZXhlcih0aGlzLnBhcnNlZCwgdGhpcylcbiAgfVxuXG4gIHRyYW5zZm9ybSAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXIgJiYgdGhpcy50cmFuc2Zvcm1lcih0aGlzLmluZGV4ZWQsIHRoaXMpXG4gIH1cblxuICBnZXQgY2FjaGVLZXkgKCkge1xuICAgIHJldHVybiBbdGhpcy5pZCwgdGhpcy5maW5nZXJwcmludC5zdWJzdHIoMCwgNildLmpvaW4oJy0nKVxuICB9XG5cbiAgZ2V0IGNhY2hlRmlsZW5hbWUgKCkge1xuICAgIHJldHVybiBbdGhpcy5jYWNoZUtleSwgdGhpcy5leHRlbnNpb25dLmpvaW4oJycpXG4gIH1cblxuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG5cbiAgbGF6eSAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5sYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICByZW5kZXIgKGFzdCA9ICd0cmFuc2Zvcm1lZCcsIG9wdGlvbnMgPSB7fSkge1xuXG4gIH1cblxuICBhc3NldFdhc0ltcG9ydGVkICgpIHtcblxuICB9XG5cbiAgYXNzZXRXYXNQcm9jZXNzZWQgKCkge1xuXG4gIH1cblxuICBjb250ZW50V2lsbENoYW5nZSAob2xkQ29udGVudCwgbmV3Q29udGVudCkge1xuXG4gIH1cblxuICBjb250ZW50RGlkQ2hhbmdlIChhc3NldCkge1xuXG4gIH1cblxuICBnZXQgYXNzZXRDbGFzcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbi5Bc3NldENsYXNzXG4gIH1cblxuICBnZXQgYXNzZXRHcm91cCAoKSB7XG4gICAgcmV0dXJuIHV0aWwudGFiZWxpemUodGhpcy5hc3NldENsYXNzLm5hbWUpXG4gIH1cblxuICBnZXQgcGFyZW50ZGlyICgpIHtcbiAgICByZXR1cm4gZGlybmFtZSh0aGlzLmRpcm5hbWUpXG4gIH1cblxuICBnZXQgZGlybmFtZSAoKSB7XG4gICAgcmV0dXJuIGRpcm5hbWUodGhpcy51cmkpXG4gIH1cblxuICBnZXQgZXh0ZW5zaW9uICgpIHtcbiAgICByZXR1cm4gZXh0bmFtZSh0aGlzLnVyaSlcbiAgfVxuXG4gIGdldCBwYXRocyAoKSB7XG4gICAgbGV0IGFzc2V0ID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8vIHJlbGF0aXZlIHRvIHRoZSBjb2xsZWN0aW9uIHJvb3RcbiAgICAgIGdldCByZWxhdGl2ZSAoKSB7XG4gICAgICAgIHJldHVybiBhc3NldC51cmkucmVwbGFjZSgvXlxcLy8sICcnKVxuICAgICAgfSxcbiAgICAgIC8vIHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IHJvb3RcbiAgICAgIGdldCBwcm9qZWN0ICgpIHtcbiAgICAgICAgcmV0dXJuIGpvaW4oYXNzZXQuY29sbGVjdGlvbi5yb290LCBhc3NldC51cmkucmVwbGFjZSgvXlxcLy8sICcnKSkucmVwbGFjZShhc3NldC5wcm9qZWN0LnJvb3QgKyAnLycsICcnKVxuICAgICAgfSxcbiAgICAgIGdldCBwcm9qZWN0UmVxdWlyZSAoKSB7XG4gICAgICAgIHJldHVybiBqb2luKGFzc2V0LmNvbGxlY3Rpb24ucm9vdCwgYXNzZXQudXJpLnJlcGxhY2UoL15cXC8vLCAnJykpLnJlcGxhY2UoYXNzZXQucHJvamVjdC5yb290ICsgJy8nLCAnJylcbiAgICAgIH0sXG4gICAgICBnZXQgYWJzb2x1dGUgKCkge1xuICAgICAgICByZXR1cm4gam9pbihhc3NldC5jb2xsZWN0aW9uLnJvb3QsIGFzc2V0LnVyaS5yZXBsYWNlKC9eXFwvLywgJycpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybiBhbnkgZGF0YXNvdXJjZXMgd2hpY2ggZXhpc3QgaW4gYSBwYXRoXG4gICogdGhhdCBpcyBpZGVudGljYWxseSBuYW1lZCB0byBjZXJ0YWluIGRlcml2YXRpdmVzIG9mIG91cnNcbiAgKi9cblxuICBnZXQgcmVsYXRlZCAoKSB7XG4gICAgcmV0dXJuIHJlbGF0aW9uc2hpcFByb3h5KHRoaXMpXG4gIH1cblxuICBfX3JlcXVpcmUgKCkge1xuICAgIGlmICh0aGlzLnJlcXVpcmVhYmxlKSB7IHJldHVybiByZXF1aXJlKHRoaXMudXJpKSB9XG4gIH1cblxuICBnZXQgcmVxdWlyZWFibGUgKCkge1xuICAgIHJldHVybiB0eXBlb2YgKHJlcXVpcmUuZXh0ZW5zaW9uc1t0aGlzLmV4dGVuc2lvbl0pID09PSAnZnVuY3Rpb24nXG4gIH1cblxuICBnZXQgZXh0ZW5zaW9uICgpIHtcbiAgICByZXR1cm4gZXh0bmFtZSh0aGlzLnVyaSlcbiAgfVxuXG4gIGxvYWRXaXRoV2VicGFjayAoKSB7XG4gICAgbGV0IHN0cmluZyA9IFt0aGlzLmxvYWRlclN0cmluZywgdGhpcy51cmldLmpvaW4oJyEnKVxuICAgIHJldHVybiByZXF1aXJlKHN0cmluZylcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVDb2xsZWN0aW9uIChwcm9qZWN0LCBhdXRvTG9hZCA9IGZhbHNlKSB7XG4gICAgbGV0IGFzc2V0Q2xhc3MgPSB0aGlzXG4gICAgbGV0IHJvb3QgPSBwcm9qZWN0LnBhdGhzW3V0aWwudGFiZWxpemUoYXNzZXRDbGFzcy5uYW1lKV1cbiAgICBsZXQgY29sbGVjdGlvbiA9IG5ldyBDb2xsZWN0aW9uKHJvb3QsIHByb2plY3QsIGFzc2V0Q2xhc3MpXG5cblxuICAgIHJldHVybiBjb2xsZWN0aW9uXG4gIH1cblxuICBzdGF0aWMgZ2V0IGdyb3VwTmFtZSAoKSB7XG4gICAgcmV0dXJuIHV0aWwucGx1cmFsaXplKHRoaXMudHlwZUFsaWFzKVxuICB9XG5cbiAgc3RhdGljIGdldCB0eXBlQWxpYXMgKCkge1xuICAgIHJldHVybiB1dGlsLnRhYmVsaXplKHRoaXMubmFtZSlcbiAgfVxufVxuXG5Bc3NldC5FWFRFTlNJT05TID0gRVhURU5TSU9OU1xuQXNzZXQuR0xPQiA9IEdMT0JcblxuZnVuY3Rpb24gcmVsYXRpb25zaGlwUHJveHkgKGFzc2V0KSB7XG4gIGNvbnN0IGdyb3VwcyA9IFsnYXNzZXRzJywgJ2RhdGFfc291cmNlcycsICdkb2N1bWVudHMnLCAnaW1hZ2VzJywgJ3NjcmlwdHMnLCAnc3R5bGVzaGVldHMnLCAndmVjdG9ycyddXG5cbiAgbGV0IGkgPSB7XG4gICAgZ2V0IGNvdW50KCl7XG4gICAgICByZXR1cm4gaS5hbGwubGVuZ3RoXG4gICAgfSxcbiAgICBnZXQgYWxsKCl7XG4gICAgICByZXR1cm4gdXRpbC5mbGF0dGVuKGdyb3Vwcy5tYXAoZ3JvdXAgPT4gaVtncm91cF0pKVxuICAgIH1cbiAgfVxuXG4gIGxldCBjb250ZW50ID0gYXNzZXQucHJvamVjdC5jb250ZW50XG5cbiAgZ3JvdXBzLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgIHV0aWwuYXNzaWduKGksIHtcbiAgICAgIGdldCBbZ3JvdXBdICgpIHtcbiAgICAgICAgbGV0IHJlbGF0ZWQgPSBjb250ZW50W2dyb3VwXS5yZWxhdGVkR2xvYihhc3NldClcbiAgICAgICAgcmV0dXJuIHJlbGF0ZWQuZmlsdGVyKGEgPT4gYS5wYXRocy5hYnNvbHV0ZSAhPSBhc3NldC5wYXRocy5hYnNvbHV0ZSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiBpXG59XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEFzc2V0XG4iXX0=