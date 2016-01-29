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

      var relData = {};

      if (this.relatedDatasources.length > 0) {
        this.relatedDatasources.forEach(function (dataSource) {
          var related = dataSource.data || {};
          var relativeId = dataSource.id.replace(_this2.id, '').replace(/^\//, '').replace(/\//g, '.');

          if (relativeId === '') {
            if (Array.isArray(dataSource.data)) {
              relData.related = relData.related || [];
              relData.related = relData.related.concat(dataSource.data);
            } else {
              relData.related = (0, _util.assign)(relData.related || {}, related);
            }
          } else {
            (0, _util.carve)(relativeId, related, relData);
          }
        });
      }

      return relData;
    }
  }, {
    key: 'relatedDatasources',
    get: function get() {
      return this.related.data_sources || [];
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
  }, {
    key: 'mainCopy',
    get: function get() {
      return this.selector('main > p').eq(0).text();
    }
  }, {
    key: 'documentTitle',
    get: function get() {
      var val = this.headings.titles.first && this.headings.titles.first.value;

      if (val) {
        return val;
      }

      var heading = this.selector('main > h1').eq(0);

      return heading && heading.length > 0 ? heading.text() : this.humanizedId;
    }
  }, {
    key: 'humanizedId',
    get: function get() {
      var parts = this.id.split(/\/|\\/);
      return (0, _util.titleize)((0, _util.humanize)(parts[parts.length - 1]));
    }
  }]);

  return Document;
})(_asset2.default);

Document.GLOB = GLOB;
Document.EXTENSIONS = EXTENSIONS;

exports = module.exports = Document;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQU9ZLGVBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU0zQixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDOUMsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFBOztJQUU1QyxRQUFRO1lBQVIsUUFBUTs7QUFDWixXQURJLFFBQVEsQ0FDQyxHQUFHLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFEMUIsUUFBUTs7dUVBQVIsUUFBUSxhQUVKLEdBQUcsRUFBRSxPQUFPOztBQUVsQixVQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFBTSw4Q0FBNkI7S0FBQSxFQUFFLEtBQUssQ0FBQyxDQUFBOztBQUVoRSxVQUFLLE1BQU0sbUJBQVMsQ0FBQTtBQUNwQixVQUFLLE9BQU8sb0JBQVUsQ0FBQTtBQUN0QixVQUFLLFdBQVcsd0JBQWMsQ0FBQTs7QUFFOUIsVUFBSyxJQUFJLENBQUMsUUFBUSxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxHQUFHLENBQUM7S0FBQSxDQUFDLENBQUE7QUFDL0MsVUFBSyxJQUFJLENBQUMsU0FBUyxFQUFFO2FBQU0sTUFBSyxLQUFLLENBQUMsTUFBSyxNQUFNLFFBQU87S0FBQSxDQUFDLENBQUE7QUFDekQsVUFBSyxJQUFJLENBQUMsYUFBYSxFQUFFO2FBQU0sTUFBSyxTQUFTLENBQUMsTUFBSyxPQUFPLFFBQU87S0FBQSxDQUFDLENBQUE7O0dBQ25FOztlQWJHLFFBQVE7O3VDQWVRO0FBQ2xCLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUNuQixZQUFJLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDZixZQUFJLENBQUMsVUFBVSxFQUFFLENB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QUksRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7S0FDekU7Ozt3QkFFaUI7QUFDaEIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDbEMsYUFBTyxVQXZMd0QsUUFBUSxFQXVMdkQsVUF2THFDLFFBQVEsRUF1THBDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNuRDs7O1NBMUtHLFFBQVE7OztBQTZLZCxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNwQixRQUFRLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTs7QUFFaEMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFBIiwiZmlsZSI6ImRvY3VtZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0IGZyb20gJy4vYXNzZXQnXG5cbmltcG9ydCB7IGNhcnZlLCBhc3NpZ24sIHNpbmd1bGFyaXplLCBwbHVyYWxpemUsIGlzQXJyYXksIGh1bWFuaXplLCB0aXRsZWl6ZSAgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL2RvY3VtZW50L3BhcnNlcidcbmltcG9ydCBpbmRleGVyIGZyb20gJy4vZG9jdW1lbnQvaW5kZXhlcidcbmltcG9ydCB0cmFuc2Zvcm1lciBmcm9tICcuL2RvY3VtZW50L3RyYW5zZm9ybWVyJ1xuaW1wb3J0IGNvbnRlbnRfaW50ZXJmYWNlIGZyb20gJy4vZG9jdW1lbnQvY29udGVudF9pbnRlcmZhY2UnXG5pbXBvcnQgKiBhcyBxdWVyeV9pbnRlcmZhY2UgZnJvbSAnLi9kb2N1bWVudC9xdWVyeV9pbnRlcmZhY2UnXG5cbmltcG9ydCB7IERvbVdyYXBwZXIgfSBmcm9tICcuL3BhcnNlcnMvaHRtbCdcblxuaW1wb3J0IGNhY2hlIGZyb20gJy4vZG9jdW1lbnQvY2FjaGUnXG5cbmNvbnN0IEVYVEVOU0lPTlMgPSBbJ21kJywgJ21hcmtkb3duJywgJ21hcmtkJ11cbmNvbnN0IEdMT0IgPSAnKiovKi57JyArIEVYVEVOU0lPTlMuam9pbignLCcpICsgJ30nXG5cbmNsYXNzIERvY3VtZW50IGV4dGVuZHMgQXNzZXQge1xuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcih1cmksIG9wdGlvbnMpXG5cbiAgICB0aGlzLmxhenkoJ2NvbnRlbnQnLCAoKSA9PiBjb250ZW50X2ludGVyZmFjZSh0aGlzLCB0aGlzKSwgZmFsc2UpXG5cbiAgICB0aGlzLnBhcnNlciA9IHBhcnNlclxuICAgIHRoaXMuaW5kZXhlciA9IGluZGV4ZXJcbiAgICB0aGlzLnRyYW5zZm9ybWVyID0gdHJhbnNmb3JtZXJcblxuICAgIHRoaXMubGF6eSgncGFyc2VkJywgKCkgPT4gdGhpcy5wYXJzZSh0aGlzLnJhdykpXG4gICAgdGhpcy5sYXp5KCdpbmRleGVkJywgKCkgPT4gdGhpcy5pbmRleCh0aGlzLnBhcnNlZCwgdGhpcykpXG4gICAgdGhpcy5sYXp5KCd0cmFuc2Zvcm1lZCcsICgpID0+IHRoaXMudHJhbnNmb3JtKHRoaXMuaW5kZXhlZCwgdGhpcykpXG4gIH1cblxuICBhc3NldFdhc0ltcG9ydGVkICgpIHtcbiAgICBpZiAodGhpcy5tb2RlbENsYXNzKSB7XG4gICAgICB0aGlzLmRlY29yYXRlKClcbiAgICAgIHRoaXMubG9hZEVudGl0eSgpXG4gICAgfVxuICB9XG5cbiAgZGVjb3JhdGUgKCkge1xuXG4gIH1cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhpcyBkb2N1bWVudCBpbnRvIGFuIEVudGl0eSBhbmQgbG9hZCBpdCBpbnRvIHRoZSBzdG9yZVxuICAqL1xuICBsb2FkRW50aXR5ICgpIHtcbiAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgdmFyIGVudGl0eVxuXG4gICAgdGhpcy5lbnN1cmVJbmRleGVzKClcblxuICAgIHRyeSB7XG4gICAgICBlbnRpdHkgPSB0aGlzLm1vZGVsQ2xhc3MucnVuKHsgZG9jdW1lbnQ6IHRoaXMsIGFzc2V0OiB0aGlzIH0sIHtwcm9qZWN0OiB0aGlzLnByb2plY3R9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhgRXJyb3IgYnVpbGRpbmcgZW50aXR5IGZyb20gZG9jdW1lbnQ6ICR7IHRoaXMuaWQgfTogJHsgZXJyb3IubWVzc2FnZSB9YClcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5tb2RlbENsYXNzLmVudGl0aWVzW3RoaXMuaWRdID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5LCB7XG4gICAgICAgIGdldCBwYXRoICgpIHtcbiAgICAgICAgICAgIHJldHVybiBhc3NldC5wYXRocy5wcm9qZWN0UmVxdWlyZVxuICAgICAgICB9LFxuICAgICAgICBnZXQgaWQgKCkge1xuICAgICAgICAgICByZXR1cm4gYXNzZXQuaWRcbiAgICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXQgaHRtbCgpIHtcbiAgICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICAgIGxldCBodG1sID0gdGhpcy5wcm9qZWN0LnJ1bi5yZW5kZXJlcignaHRtbCcsIHthc3NldH0pXG4gICAgICByZXR1cm4gRG9tV3JhcHBlcihodG1sLCB0aGlzKVxuICB9XG5cbiAgZ2V0ICQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaHRtbC5jc3NcbiAgfVxuXG4gIGdldCBzZWxlY3RvcigpIHtcbiAgICByZXR1cm4gdGhpcy5odG1sLmNzc1xuICB9XG5cbiAgZ2V0IG1vZGVsQ2xhc3MgKCkge1xuICAgIHJldHVybiB0aGlzLnByb2plY3QucmVzb2x2ZS5tb2RlbCh0aGlzKSB8fCB0aGlzLnByb2plY3QubW9kZWxzLmxvb2t1cCgncGFnZScpXG4gIH1cblxuICBnZXQgbW9kZWxEZWZpbml0b24gKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVsQ2xhc3MgJiYgdGhpcy5tb2RlbENsYXNzLmRlZmluaXRpb25cbiAgfVxuXG4gIGdldCBtZXRhZGF0YSgpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb250bWF0dGVyXG4gIH1cblxuICBnZXQgZGF0YSAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlciB8fCB7fVxuICB9XG5cbiAgZ2V0IHJlbGF0ZWREYXRhICgpIHtcbiAgICBsZXQgcmVsRGF0YSA9IHsgfVxuXG4gICAgaWYgKHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucmVsYXRlZERhdGFzb3VyY2VzLmZvckVhY2goZGF0YVNvdXJjZSA9PiB7XG4gICAgICAgIGxldCByZWxhdGVkID0gZGF0YVNvdXJjZS5kYXRhIHx8IHt9XG4gICAgICAgIGxldCByZWxhdGl2ZUlkID0gZGF0YVNvdXJjZS5pZC5yZXBsYWNlKHRoaXMuaWQsICcnKS5yZXBsYWNlKC9eXFwvLywgJycpLnJlcGxhY2UoL1xcLy9nLCAnLicpXG5cbiAgICAgICAgaWYgKHJlbGF0aXZlSWQgPT09ICcnKSB7XG4gICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YVNvdXJjZS5kYXRhKSkge1xuICAgICAgICAgICAgcmVsRGF0YS5yZWxhdGVkID0gcmVsRGF0YS5yZWxhdGVkIHx8IFtdXG4gICAgICAgICAgICByZWxEYXRhLnJlbGF0ZWQgPSByZWxEYXRhLnJlbGF0ZWQuY29uY2F0KGRhdGFTb3VyY2UuZGF0YSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVsRGF0YS5yZWxhdGVkID0gYXNzaWduKHJlbERhdGEucmVsYXRlZCB8fCB7fSwgcmVsYXRlZClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FydmUocmVsYXRpdmVJZCwgcmVsYXRlZCwgcmVsRGF0YSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICByZXR1cm4gcmVsRGF0YVxuICB9XG5cbiAgZ2V0IHJlbGF0ZWREYXRhc291cmNlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVsYXRlZC5kYXRhX3NvdXJjZXMgfHwgW11cbiAgfVxuXG4gIGdldCB0eXBlICgpIHtcbiAgICBpZiAodGhpcy5mcm9udG1hdHRlci50eXBlKSB7XG4gICAgICByZXR1cm4gdGhpcy5mcm9udG1hdHRlci50eXBlXG4gICAgfVxuXG4gICAgbGV0IHJlbGF0aXZlUGF0aCA9IHRoaXMucGF0aHMucmVsYXRpdmVcbiAgICBpZiAocmVsYXRpdmVQYXRoLm1hdGNoKCcvJykpIHsgcmV0dXJuIHNpbmd1bGFyaXplKHJlbGF0aXZlUGF0aC5zcGxpdCgnLycpWzBdKSB9XG4gIH1cblxuICBnZXQgZ3JvdXBOYW1lICgpIHtcbiAgICBpZiAodGhpcy5mcm9udG1hdHRlci5ncm91cCkge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbnRtYXR0ZXIuZ3JvdXBcbiAgICB9XG5cbiAgICBsZXQgcmVsYXRpdmVQYXRoID0gdGhpcy5wYXRocy5yZWxhdGl2ZVxuICAgIGlmIChyZWxhdGl2ZVBhdGgubWF0Y2goJy8nKSkgeyByZXR1cm4gcGx1cmFsaXplKHJlbGF0aXZlUGF0aC5zcGxpdCgnLycpWzBdKSB9XG4gIH1cblxuXG4gIGdldCBmcm9udG1hdHRlciAoKSB7XG4gICAgbGV0IG5vZGVzID0gKHRoaXMucGFyc2VkICYmIHRoaXMucGFyc2VkLmNoaWxkcmVuKSB8fCBbXVxuXG4gICAgaWYgKG5vZGVzWzBdICYmIG5vZGVzWzBdLnlhbWwpIHtcbiAgICAgIHJldHVybiBub2Rlc1swXS55YW1sXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgfVxuICB9XG5cbiAgZ2V0IGxpbmVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yYXcuc3BsaXQoJ1xcbicpXG4gIH1cblxuICBnZXQgbm9kZXMgKCkge1xuICAgIHJldHVybiBxdWVyeV9pbnRlcmZhY2Uubm9kZXModGhpcylcbiAgfVxuXG4gIGdldCBoZWFkaW5ncyAoKSB7XG4gICAgcmV0dXJuIHF1ZXJ5X2ludGVyZmFjZS5oZWFkaW5ncyh0aGlzKVxuICB9XG5cbiAgZ2V0IGNvZGUgKCkge1xuICAgIHJldHVybiBxdWVyeV9pbnRlcmZhY2UuY29kZSh0aGlzKVxuICB9XG5cbiAgZ2V0IG1haW5Db3B5ICgpIHtcbiAgICAgcmV0dXJuIHRoaXMuc2VsZWN0b3IoJ21haW4gPiBwJykuZXEoMCkudGV4dCgpXG4gIH1cblxuICBnZXQgZG9jdW1lbnRUaXRsZSAoKSB7XG4gICAgbGV0IHZhbCA9ICh0aGlzLmhlYWRpbmdzLnRpdGxlcy5maXJzdCAmJiB0aGlzLmhlYWRpbmdzLnRpdGxlcy5maXJzdC52YWx1ZSlcblxuICAgIGlmICh2YWwpIHsgcmV0dXJuIHZhbCB9XG5cbiAgICBsZXQgaGVhZGluZyA9IHRoaXMuc2VsZWN0b3IoJ21haW4gPiBoMScpLmVxKDApXG5cbiAgICByZXR1cm4gaGVhZGluZyAmJiBoZWFkaW5nLmxlbmd0aCA+IDAgPyBoZWFkaW5nLnRleHQoKSA6IHRoaXMuaHVtYW5pemVkSWRcbiAgfVxuXG4gIGdldCBodW1hbml6ZWRJZCgpIHtcbiAgICBsZXQgcGFydHMgPSB0aGlzLmlkLnNwbGl0KC9cXC98XFxcXC8pXG4gICAgcmV0dXJuIHRpdGxlaXplKGh1bWFuaXplKHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdKSlcbiAgfVxufVxuXG5Eb2N1bWVudC5HTE9CID0gR0xPQlxuRG9jdW1lbnQuRVhURU5TSU9OUyA9IEVYVEVOU0lPTlNcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gRG9jdW1lbnRcbiJdfQ==