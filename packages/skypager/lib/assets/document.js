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

var query_interface = _interopRequireWildcard(_query_interface);

var _html = require('./parsers/html');

var _cache = require('./document/cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
      var entity;

      this.ensureIndexes();

      try {
        entity = this.modelClass.run(this);
      } catch (error) {
        console.log('Error building entity', this.modelClass, error.message);
        entity = this.project.models.lookup('page').run(this);
      }

      return this.modelClass.entities[this.id] = Object.assign({}, entity, {
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
      return query_interface.nodes(this);
    }
  }, {
    key: 'headings',
    get: function get() {
      return query_interface.headings(this);
    }
  }, {
    key: 'code',
    get: function get() {
      return query_interface.code(this);
    }
  }]);

  return Document;
})(_asset2.default);

Document.GLOB = GLOB;
Document.EXTENSIONS = EXTENSIONS;

exports = module.exports = Document;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU9ZLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU0zQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBOztJQUU1QyxRQUFRO1lBQVIsUUFBUTs7QUFDWixXQURJLFFBQVEsQ0FDQyxHQUFHLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEMUIsUUFBUTs7dUVBQVIsUUFBUSxhQUVKLEdBQUcsRUFBRSxPQUFPOztBQUVsQixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFBTSw4Q0FBNkI7S0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVoRSxVQUFLLE1BQU0sbUJBQVMsQ0FBQTtBQUNwQixVQUFLLE9BQU8sb0JBQVUsQ0FBQTtBQUN0QixVQUFLLFdBQVcsd0JBQWMsQ0FBQTs7QUFFOUIsVUFBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0MsVUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxNQUFNLFFBQU87S0FBQSxDQUFDLENBQUE7QUFDekQsVUFBSyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQU0sTUFBSyxTQUFTLENBQUMsTUFBSyxPQUFPLFFBQU87S0FBQSxDQUFDLENBQUE7O0dBQ25FOztlQWJHLFFBQVE7O3VDQWVRO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ3JDOzs7aUNBRWE7QUFDWixVQUFJLEtBQUssR0FBRyxJQUFJ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O0FBRUQsYUFBTyxFQUFHLENBQUE7S0FDWDs7O3dCQUVZO0FBQ1gsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUM1Qjs7O3dCQUVZO0FBQ1gsYUFBTyxlQUFlLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ25DOzs7d0JBRWU7QUFDZCxhQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDdEM7Ozt3QkFFVztBQUNWLGFBQU8sZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNsQzs7O1NBdklHLFFBQVE7OztBQTJJZCxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNwQixRQUFRLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTs7QUFFaEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6ImRvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5cbmltcG9ydCB7IGNhcnZlLCBhc3NpZ24sIHNpbmd1bGFyaXplLCBwbHVyYWxpemUsIGlzQXJyYXkgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL2RvY3VtZW50L3BhcnNlcidcbmltcG9ydCBpbmRleGVyIGZyb20gJy4vZG9jdW1lbnQvaW5kZXhlcidcbmltcG9ydCB0cmFuc2Zvcm1lciBmcm9tICcuL2RvY3VtZW50L3RyYW5zZm9ybWVyJ1xuaW1wb3J0IGNvbnRlbnRfaW50ZXJmYWNlIGZyb20gJy4vZG9jdW1lbnQvY29udGVudF9pbnRlcmZhY2UnXG5pbXBvcnQgKiBhcyBxdWVyeV9pbnRlcmZhY2UgZnJvbSAnLi9kb2N1bWVudC9xdWVyeV9pbnRlcmZhY2UnXG5cbmltcG9ydCB7IERvbVdyYXBwZXIgfSBmcm9tICcuL3BhcnNlcnMvaHRtbCdcblxuaW1wb3J0IGNhY2hlIGZyb20gJy4vZG9jdW1lbnQvY2FjaGUnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ21kJywgJ21hcmtkb3duJywgJ21hcmtkJ11cbmNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbmNsYXNzIERvY3VtZW50IGV4dGVuZHMgQXNzZXQge1xuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih1cmksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmxhenkoJ2NvbnRlbnQnLCAoKSA9PiBjb250ZW50X2ludGVyZmFjZSh0aGlzLCB0aGlzKSwgZmFsc2UpXG5cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMuaW5kZXhlciA9IGluZGV4ZXJcbiAgICB0aGlzLnRyYW5zZm9ybWVyID0gdHJhbnNmb3JtZXJcblxuICAgIHRoaXMubGF6eSgncGFyc2VkJywgKCkgPT4gdGhpcy5wYXJzZSh0aGlzLnJhdykpXG4gICAgdGhpcy5sYXp5KCdpbmRleGVkJywgKCkgPT4gdGhpcy5pbmRleCh0aGlzLnBhcnNlZCwgdGhpcykpXG4gICAgdGhpcy5sYXp5KCd0cmFuc2Zvcm1lZCcsICgpID0+IHRoaXMudHJhbnNmb3JtKHRoaXMuaW5kZXhlZCwgdGhpcykpXG4gIH1cblxuICBhc3NldFdhc0ltcG9ydGVkICgpIHtcbiAgICB0aGlzLm1vZGVsQ2xhc3MgJiYgdGhpcy5sb2FkRW50aXR5KClcbiAgfVxuXG4gIGxvYWRFbnRpdHkgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICB2YXIgZW50aXR5XG5cbiAgICB0aGlzLmVuc3VyZUluZGV4ZXMoKVxuXG4gICAgdHJ5IHtcbiAgICAgIGVudGl0eSA9IHRoaXMubW9kZWxDbGFzcy5ydW4odGhpcylcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGJ1aWxkaW5nIGVudGl0eScsIHRoaXMubW9kZWxDbGFzcywgZXJyb3IubWVzc2FnZSlcbiAgICAgIGVudGl0eSA9IHRoaXMucHJvamVjdC5tb2RlbHMubG9va3VwKCdwYWdlJykucnVuKHRoaXMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubW9kZWxDbGFzcy5lbnRpdGllc1t0aGlzLmlkXSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwge1xuICAgICAgICBnZXQgcGF0aCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXQucGF0aHMucHJvamVjdFJlcXVpcmVcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlkICgpIHtcbiAgICAgICAgICAgcmV0dXJuIGFzc2V0LmlkXG4gICAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0IGh0bWwoKSB7XG4gICAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgICBsZXQgaHRtbCA9IHRoaXMucHJvamVjdC5ydW4ucmVuZGVyZXIoJ2h0bWwnLCB7YXNzZXR9KVxuICAgICAgcmV0dXJuIERvbVdyYXBwZXIoaHRtbCwgdGhpcylcbiAgfVxuXG4gIGdldCBtb2RlbENsYXNzICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnJlc29sdmUubW9kZWwodGhpcylcbiAgfVxuXG4gIGdldCBtb2RlbERlZmluaXRvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDbGFzcyAmJiB0aGlzLm1vZGVsQ2xhc3MuZGVmaW5pdGlvblxuICB9XG5cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXJcbiAgfVxuXG4gIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyIHx8IHt9XG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGEgKCkge1xuICAgIGxldCBtZSA9IHsgfVxuXG4gICAgaWYgKHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmZvckVhY2goZGF0YVNvdXJjZSA9PiB7XG4gICAgICAgIGxldCByZWxhdGVkID0gZGF0YVNvdXJjZS5kYXRhIHx8IHt9XG4gICAgICAgIGxldCByZWxhdGl2ZUlkID0gZGF0YVNvdXJjZS5pZC5yZXBsYWNlKHRoaXMuaWQsICcnKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG5cbiAgICAgICAgaWYgKHJlbGF0aXZlSWQgPT09ICcnKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVNvdXJjZS5kYXRhKSkge1xuICAgICAgICAgICAgbWUucmVsYXRlZCA9IG1lLnJlbGF0ZWQgfHwgW11cbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBtZS5yZWxhdGVkLmNvbmNhdChkYXRhU291cmNlLmRhdGEpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBhc3NpZ24obWUucmVsYXRlZCB8fCB7fSwgcmVsYXRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FydmUocmVsYXRpdmVJZCwgcmVsYXRlZCwgbWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG1lXG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGFzb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWxhdGVkLmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IHR5cGUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLnR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLnR5cGVcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gdGhpcy5wYXRocy5yZWxhdGl2ZVxuICAgIGlmIChyZWxhdGl2ZVBhdGgubWF0Y2goJy8nKSkgeyByZXR1cm4gc2luZ3VsYXJpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG4gIGdldCBncm91cE5hbWUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLmdyb3VwKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci5ncm91cFxuICAgIH1cblxuICAgIGxldCByZWxhdGl2ZVBhdGggPSB0aGlzLnBhdGhzLnJlbGF0aXZlXG4gICAgaWYgKHJlbGF0aXZlUGF0aC5tYXRjaCgnLycpKSB7IHJldHVybiBwbHVyYWxpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG5cbiAgZ2V0IGZyb250bWF0dGVyICgpIHtcbiAgICBsZXQgbm9kZXMgPSAodGhpcy5wYXJzZWQgJiYgdGhpcy5wYXJzZWQuY2hpbGRyZW4pIHx8IFtdXG5cbiAgICBpZiAobm9kZXNbMF0gJiYgbm9kZXNbMF0ueWFtbCkge1xuICAgICAgcmV0dXJuIG5vZGVzWzBdLnlhbWxcbiAgICB9XG5cbiAgICByZXR1cm4geyB9XG4gIH1cblxuICBnZXQgbGluZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJhdy5zcGxpdCgnXFxuJylcbiAgfVxuXG4gIGdldCBub2RlcyAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5ub2Rlcyh0aGlzKVxuICB9XG5cbiAgZ2V0IGhlYWRpbmdzICgpIHtcbiAgICByZXR1cm4gcXVlcnlfaW50ZXJmYWNlLmhlYWRpbmdzKHRoaXMpXG4gIH1cblxuICBnZXQgY29kZSAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5jb2RlKHRoaXMpXG4gIH1cblxufVxuXG5Eb2N1bWVudC5HTE9CID0gR0xPQlxuRG9jdW1lbnQuRVhURU5TSU9OUyA9IEVYVEVOU0lPTlNcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRcbiJdfQ==