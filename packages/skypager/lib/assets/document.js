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
        entity = this.modelClass.run({ document: this }, { project: this.project });
      } catch (error) {
        entity = this.project.models.lookup('page').run({ document: this }, { project: this.project });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU9ZLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU0zQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBOztJQUU1QyxRQUFRO1lBQVIsUUFBUTs7QUFDWixXQURJLFFBQVEsQ0FDQyxHQUFHLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEMUIsUUFBUTs7dUVBQVIsUUFBUSxhQUVKLEdBQUcsRUFBRSxPQUFPOztBQUVsQixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFBTSw4Q0FBNkI7S0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVoRSxVQUFLLE1BQU0sbUJBQVMsQ0FBQTtBQUNwQixVQUFLLE9BQU8sb0JBQVUsQ0FBQTtBQUN0QixVQUFLLFdBQVcsd0JBQWMsQ0FBQTs7QUFFOUIsVUFBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0MsVUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxNQUFNLFFBQU87S0FBQSxDQUFDLENBQUE7QUFDekQsVUFBSyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQU0sTUFBSyxTQUFTLENBQUMsTUFBSyxPQUFPLFFBQU87S0FBQSxDQUFDLENBQUE7O0dBQ25FOztlQWJHLFFBQVE7O3VDQWVRO0FBQ2xCLFVBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0tBQ3JDOzs7aUNBRWE7QUFDWixVQUFJLEtBQUssR0FBRyxJQUFJ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LENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO09BQ3JCOztBQUVELGFBQU8sRUFBRyxDQUFBO0tBQ1g7Ozt3QkFFWTtBQUNYLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDNUI7Ozt3QkFFWTtBQUNYLGFBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNuQzs7O3dCQUVlO0FBQ2QsYUFBTyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0tBQ3RDOzs7d0JBRVc7QUFDVixhQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEM7OztTQXRJRyxRQUFROzs7QUEwSWQsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7QUFDcEIsUUFBUSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7O0FBRWhDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQSIsImZpbGUiOiJkb2N1bWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBc3NldCBmcm9tICcuL2Fzc2V0J1xuXG5pbXBvcnQgeyBjYXJ2ZSwgYXNzaWduLCBzaW5ndWxhcml6ZSwgcGx1cmFsaXplLCBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbCdcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9kb2N1bWVudC9wYXJzZXInXG5pbXBvcnQgaW5kZXhlciBmcm9tICcuL2RvY3VtZW50L2luZGV4ZXInXG5pbXBvcnQgdHJhbnNmb3JtZXIgZnJvbSAnLi9kb2N1bWVudC90cmFuc2Zvcm1lcidcbmltcG9ydCBjb250ZW50X2ludGVyZmFjZSBmcm9tICcuL2RvY3VtZW50L2NvbnRlbnRfaW50ZXJmYWNlJ1xuaW1wb3J0ICogYXMgcXVlcnlfaW50ZXJmYWNlIGZyb20gJy4vZG9jdW1lbnQvcXVlcnlfaW50ZXJmYWNlJ1xuXG5pbXBvcnQgeyBEb21XcmFwcGVyIH0gZnJvbSAnLi9wYXJzZXJzL2h0bWwnXG5cbmltcG9ydCBjYWNoZSBmcm9tICcuL2RvY3VtZW50L2NhY2hlJ1xuXG5jb25zdCBFWFRFTlNJT05TID0gWydtZCcsICdtYXJrZG93bicsICdtYXJrZCddXG5jb25zdCBHTE9CID0gJyoqLyoueycgKyBFWFRFTlNJT05TLmpvaW4oJywnKSArICd9J1xuXG5jbGFzcyBEb2N1bWVudCBleHRlbmRzIEFzc2V0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIodXJpLCBvcHRpb25zKVxuXG4gICAgdGhpcy5sYXp5KCdjb250ZW50JywgKCkgPT4gY29udGVudF9pbnRlcmZhY2UodGhpcywgdGhpcyksIGZhbHNlKVxuXG4gICAgdGhpcy5wYXJzZXIgPSBwYXJzZXJcbiAgICB0aGlzLmluZGV4ZXIgPSBpbmRleGVyXG4gICAgdGhpcy50cmFuc2Zvcm1lciA9IHRyYW5zZm9ybWVyXG5cbiAgICB0aGlzLmxhenkoJ3BhcnNlZCcsICgpID0+IHRoaXMucGFyc2UodGhpcy5yYXcpKVxuICAgIHRoaXMubGF6eSgnaW5kZXhlZCcsICgpID0+IHRoaXMuaW5kZXgodGhpcy5wYXJzZWQsIHRoaXMpKVxuICAgIHRoaXMubGF6eSgndHJhbnNmb3JtZWQnLCAoKSA9PiB0aGlzLnRyYW5zZm9ybSh0aGlzLmluZGV4ZWQsIHRoaXMpKVxuICB9XG5cbiAgYXNzZXRXYXNJbXBvcnRlZCAoKSB7XG4gICAgdGhpcy5tb2RlbENsYXNzICYmIHRoaXMubG9hZEVudGl0eSgpXG4gIH1cblxuICBsb2FkRW50aXR5ICgpIHtcbiAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgdmFyIGVudGl0eVxuXG4gICAgdGhpcy5lbnN1cmVJbmRleGVzKClcblxuICAgIHRyeSB7XG4gICAgICBlbnRpdHkgPSB0aGlzLm1vZGVsQ2xhc3MucnVuKHsgZG9jdW1lbnQ6IHRoaXMgfSwge3Byb2plY3Q6IHRoaXMucHJvamVjdH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGVudGl0eSA9IHRoaXMucHJvamVjdC5tb2RlbHMubG9va3VwKCdwYWdlJykucnVuKHsgZG9jdW1lbnQ6IHRoaXMgfSwge3Byb2plY3Q6IHRoaXMucHJvamVjdH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubW9kZWxDbGFzcy5lbnRpdGllc1t0aGlzLmlkXSA9IE9iamVjdC5hc3NpZ24oe30sIGVudGl0eSwge1xuICAgICAgICBnZXQgcGF0aCAoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXQucGF0aHMucHJvamVjdFJlcXVpcmVcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGlkICgpIHtcbiAgICAgICAgICAgcmV0dXJuIGFzc2V0LmlkXG4gICAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0IGh0bWwoKSB7XG4gICAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgICBsZXQgaHRtbCA9IHRoaXMucHJvamVjdC5ydW4ucmVuZGVyZXIoJ2h0bWwnLCB7YXNzZXR9KVxuICAgICAgcmV0dXJuIERvbVdyYXBwZXIoaHRtbCwgdGhpcylcbiAgfVxuXG4gIGdldCBtb2RlbENsYXNzICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9qZWN0LnJlc29sdmUubW9kZWwodGhpcylcbiAgfVxuXG4gIGdldCBtb2RlbERlZmluaXRvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxDbGFzcyAmJiB0aGlzLm1vZGVsQ2xhc3MuZGVmaW5pdGlvblxuICB9XG5cbiAgZ2V0IG1ldGFkYXRhKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXJcbiAgfVxuXG4gIGdldCBkYXRhICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyIHx8IHt9XG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGEgKCkge1xuICAgIGxldCBtZSA9IHsgfVxuXG4gICAgaWYgKHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmZvckVhY2goZGF0YVNvdXJjZSA9PiB7XG4gICAgICAgIGxldCByZWxhdGVkID0gZGF0YVNvdXJjZS5kYXRhIHx8IHt9XG4gICAgICAgIGxldCByZWxhdGl2ZUlkID0gZGF0YVNvdXJjZS5pZC5yZXBsYWNlKHRoaXMuaWQsICcnKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG5cbiAgICAgICAgaWYgKHJlbGF0aXZlSWQgPT09ICcnKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVNvdXJjZS5kYXRhKSkge1xuICAgICAgICAgICAgbWUucmVsYXRlZCA9IG1lLnJlbGF0ZWQgfHwgW11cbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBtZS5yZWxhdGVkLmNvbmNhdChkYXRhU291cmNlLmRhdGEpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1lLnJlbGF0ZWQgPSBhc3NpZ24obWUucmVsYXRlZCB8fCB7fSwgcmVsYXRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FydmUocmVsYXRpdmVJZCwgcmVsYXRlZCwgbWUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIG1lXG4gIH1cblxuICBnZXQgcmVsYXRlZERhdGFzb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWxhdGVkLmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IHR5cGUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLnR5cGUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyLnR5cGVcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gdGhpcy5wYXRocy5yZWxhdGl2ZVxuICAgIGlmIChyZWxhdGl2ZVBhdGgubWF0Y2goJy8nKSkgeyByZXR1cm4gc2luZ3VsYXJpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG4gIGdldCBncm91cE5hbWUgKCkge1xuICAgIGlmICh0aGlzLmZyb250bWF0dGVyLmdyb3VwKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci5ncm91cFxuICAgIH1cblxuICAgIGxldCByZWxhdGl2ZVBhdGggPSB0aGlzLnBhdGhzLnJlbGF0aXZlXG4gICAgaWYgKHJlbGF0aXZlUGF0aC5tYXRjaCgnLycpKSB7IHJldHVybiBwbHVyYWxpemUocmVsYXRpdmVQYXRoLnNwbGl0KCcvJylbMF0pIH1cbiAgfVxuXG5cbiAgZ2V0IGZyb250bWF0dGVyICgpIHtcbiAgICBsZXQgbm9kZXMgPSAodGhpcy5wYXJzZWQgJiYgdGhpcy5wYXJzZWQuY2hpbGRyZW4pIHx8IFtdXG5cbiAgICBpZiAobm9kZXNbMF0gJiYgbm9kZXNbMF0ueWFtbCkge1xuICAgICAgcmV0dXJuIG5vZGVzWzBdLnlhbWxcbiAgICB9XG5cbiAgICByZXR1cm4geyB9XG4gIH1cblxuICBnZXQgbGluZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJhdy5zcGxpdCgnXFxuJylcbiAgfVxuXG4gIGdldCBub2RlcyAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5ub2Rlcyh0aGlzKVxuICB9XG5cbiAgZ2V0IGhlYWRpbmdzICgpIHtcbiAgICByZXR1cm4gcXVlcnlfaW50ZXJmYWNlLmhlYWRpbmdzKHRoaXMpXG4gIH1cblxuICBnZXQgY29kZSAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5jb2RlKHRoaXMpXG4gIH1cblxufVxuXG5Eb2N1bWVudC5HTE9CID0gR0xPQlxuRG9jdW1lbnQuRVhURU5TSU9OUyA9IEVYVEVOU0lPTlNcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRcbiJdfQ==