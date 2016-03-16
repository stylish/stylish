'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Document = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

var EXTENSIONS = ['md', 'markdown', 'markd'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var Document = exports.Document = (function (_Asset) {
  (0, _inherits3.default)(Document, _Asset);

  function Document(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Document);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Document).call(this, uri, options));

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

  (0, _createClass3.default)(Document, [{
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
        console.log(error.stack);
      }

      return this.modelClass.entities[this.id] = (0, _assign2.default)({}, entity, {
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

      return (0, _util.singularize)(this.paths.relative.split('/')[0] || 'document');
    }
  }, {
    key: 'groupName',
    get: function get() {
      if (this.frontmatter.group) {
        return this.frontmatter.group;
      }

      return (0, _util.pluralize)(this.paths.relative.split('/')[0] || 'document');
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

Document.EXTENSIONS = EXTENSIONS;
Document.GLOB = GLOB;
exports.default = Document;