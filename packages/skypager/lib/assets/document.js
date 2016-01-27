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
      if (this.modelClass) {
        this.decorate();
        this.loadEntity();
      }
    }
  }, {
    key: 'decorate',
    value: function decorate() {}
    /**
     * Convert this document into an Entity and load it into the store
    */

  }, {
    key: 'loadEntity',
    value: function loadEntity() {
      var asset = this;
      var entity;

      this.ensureIndexes();

      try {
        entity = this.modelClass.run({ document: this, asset: this }, { project: this.project });
      } catch (error) {
        console.log('Error building entity from document: ' + this.id + ': ' + error.message);
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
    key: '$',
    get: function get() {
      return this.html.css;
    }
  }, {
    key: 'selector',
    get: function get() {
      return this.html.css;
    }
  }, {
    key: 'modelClass',
    get: function get() {
      return this.project.resolve.model(this) || this.project.models.lookup('page');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU9ZLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU0zQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBOztJQUU1QyxRQUFRO1lBQVIsUUFBUTs7QUFDWixXQURJLFFBQVEsQ0FDQyxHQUFHLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEMUIsUUFBUTs7dUVBQVIsUUFBUSxhQUVKLEdBQUcsRUFBRSxPQUFPOztBQUVsQixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFBTSw4Q0FBNkI7S0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVoRSxVQUFLLE1BQU0sbUJBQVMsQ0FBQTtBQUNwQixVQUFLLE9BQU8sb0JBQVUsQ0FBQTtBQUN0QixVQUFLLFdBQVcsd0JBQWMsQ0FBQTs7QUFFOUIsVUFBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0MsVUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxNQUFNLFFBQU87S0FBQSxDQUFDLENBQUE7QUFDekQsVUFBSyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQU0sTUFBSyxTQUFTLENBQUMsTUFBSyxPQUFPLFFBQU87S0FBQSxDQUFDLENBQUE7O0dBQ25FOztlQWJHLFFBQVE7O3VDQWVRO0FBQ2xCLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDZixZQUFJLENBQUMsVUFBVSxFQUFFLENB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LEtBQUssR0FBRyxBQUFDLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUssRUFBRSxDQUFBOztBQUV2RCxVQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFO0FBQzdCLGVBQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtPQUNyQjs7QUFFRCxhQUFPLEVBQUcsQ0FBQTtLQUNYOzs7d0JBRVk7QUFDWCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQzVCOzs7d0JBRVk7QUFDWCxhQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbkM7Ozt3QkFFZTtBQUNkLGFBQU8sZUFBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUN0Qzs7O3dCQUVXO0FBQ1YsYUFBTyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ2xDOzs7U0F2SkcsUUFBUTs7O0FBMkpkLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ3BCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBOztBQUVoQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUEiLCJmaWxlIjoiZG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXQgZnJvbSAnLi9hc3NldCdcblxuaW1wb3J0IHsgY2FydmUsIGFzc2lnbiwgc2luZ3VsYXJpemUsIHBsdXJhbGl6ZSwgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgcGFyc2VyIGZyb20gJy4vZG9jdW1lbnQvcGFyc2VyJ1xuaW1wb3J0IGluZGV4ZXIgZnJvbSAnLi9kb2N1bWVudC9pbmRleGVyJ1xuaW1wb3J0IHRyYW5zZm9ybWVyIGZyb20gJy4vZG9jdW1lbnQvdHJhbnNmb3JtZXInXG5pbXBvcnQgY29udGVudF9pbnRlcmZhY2UgZnJvbSAnLi9kb2N1bWVudC9jb250ZW50X2ludGVyZmFjZSdcbmltcG9ydCAqIGFzIHF1ZXJ5X2ludGVyZmFjZSBmcm9tICcuL2RvY3VtZW50L3F1ZXJ5X2ludGVyZmFjZSdcblxuaW1wb3J0IHsgRG9tV3JhcHBlciB9IGZyb20gJy4vcGFyc2Vycy9odG1sJ1xuXG5pbXBvcnQgY2FjaGUgZnJvbSAnLi9kb2N1bWVudC9jYWNoZSdcblxuY29uc3QgRVhURU5TSU9OUyA9IFsnbWQnLCAnbWFya2Rvd24nLCAnbWFya2QnXVxuY29uc3QgR0xPQiA9ICcqKi8qLnsnICsgRVhURU5TSU9OUy5qb2luKCcsJykgKyAnfSdcblxuY2xhc3MgRG9jdW1lbnQgZXh0ZW5kcyBBc3NldCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKHVyaSwgb3B0aW9ucylcblxuICAgIHRoaXMubGF6eSgnY29udGVudCcsICgpID0+IGNvbnRlbnRfaW50ZXJmYWNlKHRoaXMsIHRoaXMpLCBmYWxzZSlcblxuICAgIHRoaXMucGFyc2VyID0gcGFyc2VyXG4gICAgdGhpcy5pbmRleGVyID0gaW5kZXhlclxuICAgIHRoaXMudHJhbnNmb3JtZXIgPSB0cmFuc2Zvcm1lclxuXG4gICAgdGhpcy5sYXp5KCdwYXJzZWQnLCAoKSA9PiB0aGlzLnBhcnNlKHRoaXMucmF3KSlcbiAgICB0aGlzLmxhenkoJ2luZGV4ZWQnLCAoKSA9PiB0aGlzLmluZGV4KHRoaXMucGFyc2VkLCB0aGlzKSlcbiAgICB0aGlzLmxhenkoJ3RyYW5zZm9ybWVkJywgKCkgPT4gdGhpcy50cmFuc2Zvcm0odGhpcy5pbmRleGVkLCB0aGlzKSlcbiAgfVxuXG4gIGFzc2V0V2FzSW1wb3J0ZWQgKCkge1xuICAgIGlmICh0aGlzLm1vZGVsQ2xhc3MpIHtcbiAgICAgIHRoaXMuZGVjb3JhdGUoKVxuICAgICAgdGhpcy5sb2FkRW50aXR5KClcbiAgICB9XG4gIH1cblxuICBkZWNvcmF0ZSAoKSB7XG5cbiAgfVxuICAvKipcbiAgICogQ29udmVydCB0aGlzIGRvY3VtZW50IGludG8gYW4gRW50aXR5IGFuZCBsb2FkIGl0IGludG8gdGhlIHN0b3JlXG4gICovXG4gIGxvYWRFbnRpdHkgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICB2YXIgZW50aXR5XG5cbiAgICB0aGlzLmVuc3VyZUluZGV4ZXMoKVxuXG4gICAgdHJ5IHtcbiAgICAgIGVudGl0eSA9IHRoaXMubW9kZWxDbGFzcy5ydW4oeyBkb2N1bWVudDogdGhpcywgYXNzZXQ6IHRoaXMgfSwge3Byb2plY3Q6IHRoaXMucHJvamVjdH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBidWlsZGluZyBlbnRpdHkgZnJvbSBkb2N1bWVudDogJHsgdGhpcy5pZCB9OiAkeyBlcnJvci5tZXNzYWdlIH1gKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1vZGVsQ2xhc3MuZW50aXRpZXNbdGhpcy5pZF0gPSBPYmplY3QuYXNzaWduKHt9LCBlbnRpdHksIHtcbiAgICAgICAgZ2V0IHBhdGggKCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0LnBhdGhzLnByb2plY3RSZXF1aXJlXG4gICAgICAgIH0sXG4gICAgICAgIGdldCBpZCAoKSB7XG4gICAgICAgICAgIHJldHVybiBhc3NldC5pZFxuICAgICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldCBodG1sKCkge1xuICAgICAgbGV0IGFzc2V0ID0gdGhpc1xuICAgICAgbGV0IGh0bWwgPSB0aGlzLnByb2plY3QucnVuLnJlbmRlcmVyKCdodG1sJywge2Fzc2V0fSlcbiAgICAgIHJldHVybiBEb21XcmFwcGVyKGh0bWwsIHRoaXMpXG4gIH1cblxuICBnZXQgJCgpIHtcbiAgICByZXR1cm4gdGhpcy5odG1sLmNzc1xuICB9XG5cbiAgZ2V0IHNlbGVjdG9yKCkge1xuICAgIHJldHVybiB0aGlzLmh0bWwuY3NzXG4gIH1cblxuICBnZXQgbW9kZWxDbGFzcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvamVjdC5yZXNvbHZlLm1vZGVsKHRoaXMpIHx8IHRoaXMucHJvamVjdC5tb2RlbHMubG9va3VwKCdwYWdlJylcbiAgfVxuXG4gIGdldCBtb2RlbERlZmluaXRvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDbGFzcyAmJiB0aGlzLm1vZGVsQ2xhc3MuZGVmaW5pdGlvblxuICB9XG5cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXJcbiAgfVxuXG4gIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyIHx8IHt9XG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGEgKCkge1xuICAgIGxldCBtZSA9IHsgfVxuXG4gICAgaWYgKHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmZvckVhY2goZGF0YVNvdXJjZSA9PiB7XG4gICAgICAgIGxldCByZWxhdGVkID0gZGF0YVNvdXJjZS5kYXRhIHx8IHt9XG4gICAgICAgIGxldCByZWxhdGl2ZUlkID0gZGF0YVNvdXJjZS5pZC5yZXBsYWNlKHRoaXMuaWQsICcnKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG5cbiAgICAgICAgaWYgKHJlbGF0aXZlSWQgPT09ICcnKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVNvdXJjZS5kYXRhKSkge1xuICAgICAgICAgICAgbWUucmVsYXRlZCA9IG1lLnJlbGF0ZWQgfHwgW11cbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBtZS5yZWxhdGVkLmNvbmNhdChkYXRhU291cmNlLmRhdGEpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBhc3NpZ24obWUucmVsYXRlZCB8fCB7fSwgcmVsYXRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FydmUocmVsYXRpdmVJZCwgcmVsYXRlZCwgbWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG1lXG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGFzb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWxhdGVkLmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IHR5cGUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLnR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLnR5cGVcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gdGhpcy5wYXRocy5yZWxhdGl2ZVxuICAgIGlmIChyZWxhdGl2ZVBhdGgubWF0Y2goJy8nKSkgeyByZXR1cm4gc2luZ3VsYXJpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG4gIGdldCBncm91cE5hbWUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLmdyb3VwKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci5ncm91cFxuICAgIH1cblxuICAgIGxldCByZWxhdGl2ZVBhdGggPSB0aGlzLnBhdGhzLnJlbGF0aXZlXG4gICAgaWYgKHJlbGF0aXZlUGF0aC5tYXRjaCgnLycpKSB7IHJldHVybiBwbHVyYWxpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG5cbiAgZ2V0IGZyb250bWF0dGVyICgpIHtcbiAgICBsZXQgbm9kZXMgPSAodGhpcy5wYXJzZWQgJiYgdGhpcy5wYXJzZWQuY2hpbGRyZW4pIHx8IFtdXG5cbiAgICBpZiAobm9kZXNbMF0gJiYgbm9kZXNbMF0ueWFtbCkge1xuICAgICAgcmV0dXJuIG5vZGVzWzBdLnlhbWxcbiAgICB9XG5cbiAgICByZXR1cm4geyB9XG4gIH1cblxuICBnZXQgbGluZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJhdy5zcGxpdCgnXFxuJylcbiAgfVxuXG4gIGdldCBub2RlcyAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5ub2Rlcyh0aGlzKVxuICB9XG5cbiAgZ2V0IGhlYWRpbmdzICgpIHtcbiAgICByZXR1cm4gcXVlcnlfaW50ZXJmYWNlLmhlYWRpbmdzKHRoaXMpXG4gIH1cblxuICBnZXQgY29kZSAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5jb2RlKHRoaXMpXG4gIH1cblxufVxuXG5Eb2N1bWVudC5HTE9CID0gR0xPQlxuRG9jdW1lbnQuRVhURU5TSU9OUyA9IEVYVEVOU0lPTlNcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRcbiJdfQ==