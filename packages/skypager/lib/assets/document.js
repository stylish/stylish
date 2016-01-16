'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _asset = require('./asset');

var _asset2 = _interopRequireDefault(_asset);

var _util = require('../util');

var _parser = require('./document/parser');

var _parser2 = _interopRequireDefault(_parser);

var _indexer = require('./document/indexer');

var _indexer2 = _interopRequireDefault(_indexer);

var _transformer = require('./document/transformer');

var _transformer2 = _interopRequireDefault(_transformer);

var _content_interface = require('./document/content_interface');

var _content_interface2 = _interopRequireDefault(_content_interface);

var _query_interface = require('./document/query_interface');

var _query_interface2 = _interopRequireDefault(_query_interface);

var _html = require('./parsers/html');

var _cache = require('./document/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EXTENSIONS = ['md', 'markdown', 'markd'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var Document = (function (_Asset) {
  _inherits(Document, _Asset);

  function Document(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Document);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Document).call(this, uri, options));

    _this.lazy('content', function () {
      return (0, _content_interface2.default)(_this, _this);
    }, false);

    _this.parser = _parser2.default;
    _this.indexer = _indexer2.default;
    _this.transformer = _transformer2.default;

    _this.lazy('parsed', function () {
      return _this.parse(_this.raw);
    });
    _this.lazy('indexed', function () {
      return _this.index(_this.parsed, _this);
    });
    _this.lazy('transformed', function () {
      return _this.transform(_this.indexed, _this);
    });
    return _this;
  }

  _createClass(Document, [{
    key: 'assetWasImported',
    value: function assetWasImported() {
      this.modelClass && this.loadEntity();
    }
  }, {
    key: 'loadEntity',
    value: function loadEntity() {
      var asset = this;

      this.ensureIndexes();

      return this.modelClass.entities[this.id] = Object.assign({}, this.modelClass.run(this), {
        get path() {
          return asset.paths.projectRequire;
        },
        get id() {
          return asset.id;
        }
      });
    }
  }, {
    key: 'html',
    get: function get() {
      var asset = this;
      var html = this.project.run.renderer('html', { asset: asset });
      return (0, _html.DomWrapper)(html, this);
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
    key: 'metadata',
    get: function get() {
      return this.frontmatter;
    }
  }, {
    key: 'data',
    get: function get() {
      return this.frontmatter || {};
    }
  }, {
    key: 'relatedData',
    get: function get() {
      var _this2 = this;

      var me = {};

      if (this.relatedDatasources.length > 0) {
        this.relatedDatasources.forEach(function (dataSource) {
          var related = dataSource.data || {};
          var relativeId = dataSource.id.replace(_this2.id, '').replace(/^\//, '').replace(/\//g, '.');

          if (relativeId === '') {
            if (Array.isArray(dataSource.data)) {
              me.related = me.related || [];
              me.related = me.related.concat(dataSource.data);
            } else {
              me.related = (0, _util.assign)(me.related || {}, related);
            }
          } else {
            (0, _util.carve)(relativeId, related, me);
          }
        });
      }

      return me;
    }
  }, {
    key: 'relatedDatasources',
    get: function get() {
      return this.related.data_sources;
    }
  }, {
    key: 'type',
    get: function get() {
      if (this.frontmatter.type) {
        return this.frontmatter.type;
      }

      var relativePath = this.paths.relative;
      if (relativePath.match('/')) {
        return (0, _util.singularize)(relativePath.split('/')[0]);
      }
    }
  }, {
    key: 'groupName',
    get: function get() {
      if (this.frontmatter.group) {
        return this.frontmatter.group;
      }

      var relativePath = this.paths.relative;
      if (relativePath.match('/')) {
        return (0, _util.pluralize)(relativePath.split('/')[0]);
      }
    }
  }, {
    key: 'frontmatter',
    get: function get() {
      var nodes = this.parsed && this.parsed.children || [];

      if (nodes[0] && nodes[0].yaml) {
        return nodes[0].yaml;
      }

      return {};
    }
  }, {
    key: 'lines',
    get: function get() {
      return this.raw.split('\n');
    }
  }, {
    key: 'nodes',
    get: function get() {
      return _query_interface2.default.nodes(this);
    }
  }, {
    key: 'headings',
    get: function get() {
      return _query_interface2.default.headings(this);
    }
  }, {
    key: 'code',
    get: function get() {
      return _query_interface2.default.code(this);
    }
  }]);

  return Document;
})(_asset2.default);

Document.GLOB = GLOB;
Document.EXTENSIONS = EXTENSIONS;

exports = module.exports = Document;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQSxJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBOztJQUU1QyxRQUFRO1lBQVIsUUFBUTs7QUFDWixXQURJLFFBQVEsQ0FDQyxHQUFHLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEMUIsUUFBUTs7dUVBQVIsUUFBUSxhQUVKLEdBQUcsRUFBRSxPQUFPOztBQUVsQixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFBTSw4Q0FBNkI7S0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVoRSxVQUFLLE1BQU0sbUJBQVMsQ0FBQTtBQUNwQixVQUFLLE9BQU8sb0JBQVUsQ0FBQTtBQUN0QixVQUFLLFdBQVcsd0JBQWMsQ0FBQTs7QUFFOUIsVUFBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0MsVUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxNQUFNLFFBQU87S0FBQSxDQUFDLENBQUE7QUFDekQsVUFBSyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQU0sTUFBSyxTQUFTLENBQUMsTUFBSyxPQUFPLFFBQU87S0FBQSxDQUFDLENBQUE7O0dBQ25FOztlQWJHLFFBQVE7O3VDQWVRO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ3JDOzs7aUNBRWE7QUFDWixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7O0FBRWhC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QUFtSWQsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7O0FBRWhDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiJkb2N1bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldCBmcm9tICcuL2Fzc2V0J1xuXG5pbXBvcnQgeyBjYXJ2ZSwgYXNzaWduLCBzaW5ndWxhcml6ZSwgcGx1cmFsaXplLCBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9kb2N1bWVudC9wYXJzZXInXG5pbXBvcnQgaW5kZXhlciBmcm9tICcuL2RvY3VtZW50L2luZGV4ZXInXG5pbXBvcnQgdHJhbnNmb3JtZXIgZnJvbSAnLi9kb2N1bWVudC90cmFuc2Zvcm1lcidcbmltcG9ydCBjb250ZW50X2ludGVyZmFjZSBmcm9tICcuL2RvY3VtZW50L2NvbnRlbnRfaW50ZXJmYWNlJ1xuaW1wb3J0IHF1ZXJ5X2ludGVyZmFjZSBmcm9tICcuL2RvY3VtZW50L3F1ZXJ5X2ludGVyZmFjZSdcblxuaW1wb3J0IHsgRG9tV3JhcHBlciB9IGZyb20gJy4vcGFyc2Vycy9odG1sJ1xuXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi9kb2N1bWVudC9jYWNoZSdcblxuY29uc3QgRVhURU5TSU9OUyA9IFsnbWQnLCAnbWFya2Rvd24nLCAnbWFya2QnXVxuY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBBc3NldCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHVyaSwgb3B0aW9ucylcblxuICAgIHRoaXMubGF6eSgnY29udGVudCcsICgpID0+IGNvbnRlbnRfaW50ZXJmYWNlKHRoaXMsIHRoaXMpLCBmYWxzZSlcblxuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyXG4gICAgdGhpcy5pbmRleGVyID0gaW5kZXhlclxuICAgIHRoaXMudHJhbnNmb3JtZXIgPSB0cmFuc2Zvcm1lclxuXG4gICAgdGhpcy5sYXp5KCdwYXJzZWQnLCAoKSA9PiB0aGlzLnBhcnNlKHRoaXMucmF3KSlcbiAgICB0aGlzLmxhenkoJ2luZGV4ZWQnLCAoKSA9PiB0aGlzLmluZGV4KHRoaXMucGFyc2VkLCB0aGlzKSlcbiAgICB0aGlzLmxhenkoJ3RyYW5zZm9ybWVkJywgKCkgPT4gdGhpcy50cmFuc2Zvcm0odGhpcy5pbmRleGVkLCB0aGlzKSlcbiAgfVxuXG4gIGFzc2V0V2FzSW1wb3J0ZWQgKCkge1xuICAgIHRoaXMubW9kZWxDbGFzcyAmJiB0aGlzLmxvYWRFbnRpdHkoKVxuICB9XG5cbiAgbG9hZEVudGl0eSAoKSB7XG4gICAgbGV0IGFzc2V0ID0gdGhpc1xuXG4gICAgdGhpcy5lbnN1cmVJbmRleGVzKClcblxuICAgIHJldHVybiB0aGlzLm1vZGVsQ2xhc3MuZW50aXRpZXNbdGhpcy5pZF0gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLm1vZGVsQ2xhc3MucnVuKHRoaXMpLCB7XG4gICAgICAgIGdldCBwYXRoICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldC5wYXRocy5wcm9qZWN0UmVxdWlyZVxuICAgICAgICB9LFxuICAgICAgICBnZXQgaWQgKCkge1xuICAgICAgICAgICByZXR1cm4gYXNzZXQuaWRcbiAgICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXQgaHRtbCgpIHtcbiAgICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICAgIGxldCBodG1sID0gdGhpcy5wcm9qZWN0LnJ1bi5yZW5kZXJlcignaHRtbCcsIHthc3NldH0pXG4gICAgICByZXR1cm4gRG9tV3JhcHBlcihodG1sLCB0aGlzKVxuICB9XG5cbiAgZ2V0IG1vZGVsQ2xhc3MgKCkge1xuICAgIHJldHVybiB0aGlzLnByb2plY3QucmVzb2x2ZS5tb2RlbCh0aGlzKVxuICB9XG5cbiAgZ2V0IG1vZGVsRGVmaW5pdG9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbENsYXNzICYmIHRoaXMubW9kZWxDbGFzcy5kZWZpbml0aW9uXG4gIH1cblxuICBnZXQgbWV0YWRhdGEoKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlclxuICB9XG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXIgfHwge31cbiAgfVxuXG4gIGdldCByZWxhdGVkRGF0YSAoKSB7XG4gICAgbGV0IG1lID0geyB9XG5cbiAgICBpZiAodGhpcy5yZWxhdGVkRGF0YXNvdXJjZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5yZWxhdGVkRGF0YXNvdXJjZXMuZm9yRWFjaChkYXRhU291cmNlID0+IHtcbiAgICAgICAgbGV0IHJlbGF0ZWQgPSBkYXRhU291cmNlLmRhdGEgfHwge31cbiAgICAgICAgbGV0IHJlbGF0aXZlSWQgPSBkYXRhU291cmNlLmlkLnJlcGxhY2UodGhpcy5pZCwgJycpLnJlcGxhY2UoL15cXC8vLCAnJykucmVwbGFjZSgvXFwvL2csICcuJylcblxuICAgICAgICBpZiAocmVsYXRpdmVJZCA9PT0gJycpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhU291cmNlLmRhdGEpKSB7XG4gICAgICAgICAgICBtZS5yZWxhdGVkID0gbWUucmVsYXRlZCB8fCBbXVxuICAgICAgICAgICAgbWUucmVsYXRlZCA9IG1lLnJlbGF0ZWQuY29uY2F0KGRhdGFTb3VyY2UuZGF0YSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWUucmVsYXRlZCA9IGFzc2lnbihtZS5yZWxhdGVkIHx8IHt9LCByZWxhdGVkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYXJ2ZShyZWxhdGl2ZUlkLCByZWxhdGVkLCBtZSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gbWVcbiAgfVxuXG4gIGdldCByZWxhdGVkRGF0YXNvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlbGF0ZWQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgdHlwZSAoKSB7XG4gICAgaWYgKHRoaXMuZnJvbnRtYXR0ZXIudHlwZSkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXIudHlwZVxuICAgIH1cblxuICAgIGxldCByZWxhdGl2ZVBhdGggPSB0aGlzLnBhdGhzLnJlbGF0aXZlXG4gICAgaWYgKHJlbGF0aXZlUGF0aC5tYXRjaCgnLycpKSB7IHJldHVybiBzaW5ndWxhcml6ZShyZWxhdGl2ZVBhdGguc3BsaXQoJy8nKVswXSkgfVxuICB9XG5cbiAgZ2V0IGdyb3VwTmFtZSAoKSB7XG4gICAgaWYgKHRoaXMuZnJvbnRtYXR0ZXIuZ3JvdXApIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLmdyb3VwXG4gICAgfVxuXG4gICAgbGV0IHJlbGF0aXZlUGF0aCA9IHRoaXMucGF0aHMucmVsYXRpdmVcbiAgICBpZiAocmVsYXRpdmVQYXRoLm1hdGNoKCcvJykpIHsgcmV0dXJuIHBsdXJhbGl6ZShyZWxhdGl2ZVBhdGguc3BsaXQoJy8nKVswXSkgfVxuICB9XG5cblxuICBnZXQgZnJvbnRtYXR0ZXIgKCkge1xuICAgIGxldCBub2RlcyA9ICh0aGlzLnBhcnNlZCAmJiB0aGlzLnBhcnNlZC5jaGlsZHJlbikgfHwgW11cblxuICAgIGlmIChub2Rlc1swXSAmJiBub2Rlc1swXS55YW1sKSB7XG4gICAgICByZXR1cm4gbm9kZXNbMF0ueWFtbFxuICAgIH1cblxuICAgIHJldHVybiB7IH1cbiAgfVxuXG4gIGdldCBsaW5lcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmF3LnNwbGl0KCdcXG4nKVxuICB9XG5cbiAgZ2V0IG5vZGVzICgpIHtcbiAgICByZXR1cm4gcXVlcnlfaW50ZXJmYWNlLm5vZGVzKHRoaXMpXG4gIH1cblxuICBnZXQgaGVhZGluZ3MgKCkge1xuICAgIHJldHVybiBxdWVyeV9pbnRlcmZhY2UuaGVhZGluZ3ModGhpcylcbiAgfVxuXG4gIGdldCBjb2RlICgpIHtcbiAgICByZXR1cm4gcXVlcnlfaW50ZXJmYWNlLmNvZGUodGhpcylcbiAgfVxuXG59XG5cbkRvY3VtZW50LkdMT0IgPSBHTE9CXG5Eb2N1bWVudC5FWFRFTlNJT05TID0gRVhURU5TSU9OU1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBEb2N1bWVudFxuIl19