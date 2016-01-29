'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tracker = {};
var _curr = undefined;

function current() {
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

var ModelDefinition = exports.ModelDefinition = (function () {
  function ModelDefinition(description) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var body = arguments[2];

    _classCallCheck(this, ModelDefinition);

    var currentDefinition = this;

    this.description = description;
    this.name = description;

    if (!body && typeof options === 'function') {
      body = options;
      options = {};
    }

    this.body = body.bind(this);
    this.options = options;

    this.config = {};

    if (options.required && options.required.definition) {
      this.config = Object.assign(this.config, options.required.definition);
    }

    _util.hide.getter(this, 'documents', this.configureDocuments.bind(this));
    _util.hide.getter(this, 'data_sources', this.configureDataSources.bind(this));

    _util.hide.getter(this, 'api', function () {
      return {
        create: _this.config.creator || _this.helperExport.create || defaultCreateMethod,
        validate: _this.config.validator || _this.helperExport.validate || defaultValidateMethod,
        runner: function runner() {
          var _currentHelper$api, _currentHelper$api2;

          (_currentHelper$api = currentHelper.api).decorate.apply(_currentHelper$api, arguments);
          return (_currentHelper$api2 = currentHelper.api).create.apply(_currentHelper$api2, arguments);
        },
        config: Object.assign({}, _this.config, _this.helperExport.config || {}),
        decorate: _this.config.decorator || _this.helperExport.decorate || defaultDecorateMethod,
        generate: _this.config.generator || _this.helperExport.generate || defaultGenerateMethod,
        actions: _this.config.actions || []
      };
    });
  }

  _createClass(ModelDefinition, [{
    key: 'actions',
    value: function actions() {
      var _config$actions;

      this.config.actions = this.config.actions || [];
      (_config$actions = this.config.actions).push.apply(_config$actions, arguments);
    }
  }, {
    key: 'generator',
    value: function generator(fn) {
      this.config.generator = fn;
    }
  }, {
    key: 'decorator',
    value: function decorator(fn) {
      this.config.decorator = fn;
    }
  }, {
    key: 'creator',
    value: function creator(fn) {
      this.config.creator = fn;
    }
  }, {
    key: 'validator',
    value: function validator(fn) {
      this.config.validator = fn;
    }
  }, {
    key: 'configure',
    value: function configure() {
      this.body(this);
      this.documents.configure();
    }
  }, {
    key: 'configureDocuments',
    value: function configureDocuments() {
      return this.config.documents = this.config.documents || new DocumentConfiguration(this);
    }
  }, {
    key: 'configureDataSources',
    value: function configureDataSources() {
      return this.config.data_sources = this.config.data_sources || new DataSourceConfiguration(this);
    }
  }, {
    key: 'documentConfig',
    get: function get() {
      return this.config.documents;
    }
  }, {
    key: 'sectionsConfig',
    get: function get() {
      return this.documentConfig && this.documentConfig.sectionsConfig;
    }
  }]);

  return ModelDefinition;
})();

var DocumentConfiguration = (function () {
  function DocumentConfiguration(modelDefinition) {
    _classCallCheck(this, DocumentConfiguration);

    _util.hide.getter(this, 'parent', modelDefinition);

    var sectionsConfig = {};

    this.config = {
      get sections() {
        return sectionsConfig;
      }
    };

    createChainMethods(this, 'a', 'has', 'have', 'many');
  }

  _createClass(DocumentConfiguration, [{
    key: 'configure',
    value: function configure() {
      (0, _util.values)(this.config.sections).forEach(function (section) {
        return section.configure();
      });
    }
  }, {
    key: 'sections',
    value: function sections(groupName) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var mapFn = arguments[2];

      if (!mapFn && typeof options === 'function') {
        mapFn = options;
        options = {};
      }

      options.type = 'map';
      options.parent = this;
      this.config.sections[(0, _util.underscore)(groupName)] = new SectionConfiguration(groupName, options, mapFn);
    }
  }, {
    key: 'section',
    value: function section(sectionIdentifier) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var buildFn = arguments[2];

      if (!buildFn && typeof options === 'function') {
        buildFn = options;
        options = {};
      }

      options.type = 'builder';
      options.parent = this;
      this.config.sections[(0, _util.underscore)(sectionIdentifier)] = new SectionConfiguration(sectionIdentifier, options, buildFn);
    }
  }, {
    key: 'sectionsConfig',
    get: function get() {
      return this.config.sections;
    }
  }]);

  return DocumentConfiguration;
})();

/**
* Sections are configured individually by name
*/

var SectionConfiguration = (function () {
  function SectionConfiguration(sectionIdentifier) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var body = arguments[2];

    _classCallCheck(this, SectionConfiguration);

    this.name = sectionIdentifier;

    if (!body && typeof options === 'function') {
      body = options;
      options = {};
    }

    this.body = body.bind(this);
    this.builderType = options.type || 'builder';

    var articlesConfig = {};

    this.config = {
      get articles() {
        return articlesConfig;
      }
    };

    _util.hide.getter(this, 'parent', options.parent);

    createChainMethods(this, 'a', 'has', 'have', 'many');
  }

  _createClass(SectionConfiguration, [{
    key: 'configure',
    value: function configure() {
      this.body(this);
      (0, _util.values)(this.config.articles).forEach(function (article) {
        return article.configure && article.configure();
      });
    }
  }, {
    key: 'article',
    value: function article(name) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var articleBuilder = arguments[2];

      options.type = 'builder';
      options.parent = this;
      return this.config.articles[(0, _util.underscore)(name)] = new ArticleConfiguration(name, options, articleBuilder);
    }
  }, {
    key: 'articles',
    value: function articles(name) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var articleBuilder = arguments[2];

      options.type = 'map';
      options.parent = this;
      return this.config.articles[(0, _util.underscore)(name)] = new ArticleConfiguration(name, options, articleBuilder);
    }
  }, {
    key: 'slug',
    get: function get() {
      return (0, _util.slugify)(this.name);
    }
  }]);

  return SectionConfiguration;
})();

var ArticleConfiguration = (function () {
  function ArticleConfiguration(groupName) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var body = arguments[2];

    _classCallCheck(this, ArticleConfiguration);

    this.name = groupName;

    if (!body && typeof options === 'function') {
      body = options;
      options = {};
    }

    this.builderType = options.type || 'map';
    this.body = body.bind(this);

    createChainMethods(this, 'a', 'has', 'have', 'many');
  }

  _createClass(ArticleConfiguration, [{
    key: 'configure',
    value: function configure() {
      this.body(this);
    }
  }, {
    key: 'slug',
    get: function get() {
      return (0, _util.slugify)(this.name);
    }
  }]);

  return ArticleConfiguration;
})();

var DataSourceConfiguration = function DataSourceConfiguration(modelDefinition) {
  _classCallCheck(this, DataSourceConfiguration);
};

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

(0, _util.assign)(DSL, {
  assign: _util.assign,
  singularize: _util.singularize,
  pluralize: _util.pluralize,
  slugify: _util.slugify,
  current: current,
  underscore: _util.underscore,
  tabelize: _util.tabelize,
  lazy: _util.lazy,
  describe: describe,
  model: describe,
  define: describe,
  validate: function validate() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).validator.apply(_tracker$_curr, arguments);
  },
  validator: function validator() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).validator.apply(_tracker$_curr2, arguments);
  },
  decorator: function decorator() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).decorator.apply(_tracker$_curr3, arguments);
  },
  decorate: function decorate() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).decorator.apply(_tracker$_curr4, arguments);
  },
  creator: function creator() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).creator.apply(_tracker$_curr5, arguments);
  },
  create: function create() {
    var _tracker$_curr6;

    (_tracker$_curr6 = tracker[_curr]).creator.apply(_tracker$_curr6, arguments);
  },
  generator: function generator() {
    var _tracker$_curr7;

    (_tracker$_curr7 = tracker[_curr]).generator.apply(_tracker$_curr7, arguments);
  },
  generate: function generate() {
    var _tracker$_curr8;

    (_tracker$_curr8 = tracker[_curr]).generator.apply(_tracker$_curr8, arguments);
  },
  attributes: function attributes() {
    var _tracker$_curr9;

    (_tracker$_curr9 = tracker[_curr]).attributes.apply(_tracker$_curr9, arguments);
  },
  actions: function actions() {
    var _tracker$_curr10;

    (_tracker$_curr10 = tracker[_curr]).actions.apply(_tracker$_curr10, arguments);
  }
});

function lookup(modelName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(modelName)).toLowerCase()];
}

function describe(modelName, fn) {
  if (!fn) {
    throw 'model definition started with no configuration function';
  }

  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(modelName)).toLowerCase()] = new ModelDefinition(modelName, fn);
}

function createChainMethods(target) {
  for (var _len = arguments.length, methods = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    methods[_key - 1] = arguments[_key];
  }

  methods.forEach(function (method) {
    Object.defineProperty(target, method, {
      configurable: true,
      get: function get() {
        return target;
      }
    });
  });
}

function defaultCreateMethod() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var asset = options.asset || options.document;

  return {
    id: asset.id,
    uri: asset.uri,
    metadata: asset.data,
    content: asset.content
  };
}

function defaultValidateMethod() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return true;
}

function defaultGenerateMethod() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var str = '';
  var frontmatter = Object.assign({}, options.data || {});
  var attrs = options.attributes || options.attrs || {};

  if (Object.keys(frontmatter).length > 0) {
    str = '---\n' + _jsYaml2.default.dump(frontmatter) + '---\n\n';
  }

  if (options.content) {
    return str = str + (options.content + '\n');
  }

  if (attrs.title) {
    str = str + ('# ' + attrs.title);
  }

  return str;
}

function defaultDecorateMethod() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return [options, context];
}

ModelDefinition.current = current;
ModelDefinition.clearDefinition = clearDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBeU5nQixHQUFHLEdBQUgsR0FBRztRQXVESCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7Ozs7O0FBN1F0QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBSTtBQUFFLFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7QUFDN0MsU0FBUyxlQUFlLEdBQUk7QUFBRSxPQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FBRTs7SUFFdEQsZUFBZSxXQUFmLGVBQWU7QUFDMUIsV0FEVyxlQUFlLENBQ2IsV0FBVyxFQUFzQjs7O1FBQXBCLE9BQU8seURBQUcsRUFBRTtRQUFFLElBQUk7OzBCQURqQyxlQUFlOztBQUV4QixRQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQTs7QUFFNUIsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUE7O0FBRXZCLFFBQUksQ0FBQyxJQUFJLElBQUksT0FBUSxPQUFPLEFBQUMsS0FBRyxVQUFVLEVBQUU7QUFDMUMsVUFBSSxHQUFHLE9BQU8sQ0FBQTtBQUNkLGFBQU8sR0FBRyxFQUFFLENBQUE7S0FDYjs7QUFFRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBOztBQUVoQixRQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUM7QUFDakQsVUFBSSxDQUFDLE1BQU0sR0FB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QyxLQUFLLENBQUcsQ0FBQTtHQUNqQzs7QUFFRCxTQUFPLEdBQUcsQ0FBQTtDQUNYOztBQUVELFNBQVMscUJBQXFCLEdBQTZCO01BQTNCLE9BQU8seURBQUcsRUFBRTtNQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDeEQsU0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtDQUMxQjs7QUFFRCxlQUFlLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUNqQyxlQUFlLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQSIsImZpbGUiOiJtb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRhYmVsaXplLCBwbHVyYWxpemUsIHNpbmd1bGFyaXplLCBwYXJhbWV0ZXJpemUsIG5vQ29uZmxpY3QsIGFzc2lnbiwgaGlkZSwgbGF6eSwgdmFsdWVzLCBzbHVnaWZ5LCB1bmRlcnNjb3JlIH0gZnJvbSAnLi4vLi4vdXRpbCdcbmltcG9ydCB5YW1sIGZyb20gJ2pzLXlhbWwnXG5cbmxldCB0cmFja2VyID0geyB9XG5sZXQgX2N1cnJcblxuZnVuY3Rpb24gY3VycmVudCAoKSB7IHJldHVybiB0cmFja2VyW19jdXJyXSB9XG5mdW5jdGlvbiBjbGVhckRlZmluaXRpb24gKCkgeyBfY3VyciA9IG51bGw7IGRlbGV0ZSB0cmFja2VyW19jdXJyXSB9XG5cbmV4cG9ydCBjbGFzcyBNb2RlbERlZmluaXRpb24ge1xuICBjb25zdHJ1Y3RvciAoZGVzY3JpcHRpb24sIG9wdGlvbnMgPSB7fSwgYm9keSkge1xuICAgIGxldCBjdXJyZW50RGVmaW5pdGlvbiA9IHRoaXNcblxuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvblxuICAgIHRoaXMubmFtZSA9IGRlc2NyaXB0aW9uXG5cbiAgICBpZiAoIWJvZHkgJiYgdHlwZW9mIChvcHRpb25zKT09PSdmdW5jdGlvbicpIHtcbiAgICAgIGJvZHkgPSBvcHRpb25zXG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLmJvZHkgPSBib2R5LmJpbmQodGhpcylcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmNvbmZpZyA9IHt9XG5cbiAgICBpZihvcHRpb25zLnJlcXVpcmVkICYmIG9wdGlvbnMucmVxdWlyZWQuZGVmaW5pdGlvbil7XG4gICAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIG9wdGlvbnMucmVxdWlyZWQuZGVmaW5pdGlvbilcbiAgICB9XG5cbiAgICBoaWRlLmdldHRlcih0aGlzLCAnZG9jdW1lbnRzJywgdGhpcy5jb25maWd1cmVEb2N1bWVudHMuYmluZCh0aGlzKSlcbiAgICBoaWRlLmdldHRlcih0aGlzLCAnZGF0YV9zb3VyY2VzJywgdGhpcy5jb25maWd1cmVEYXRhU291cmNlcy5iaW5kKHRoaXMpKVxuXG4gICAgaGlkZS5nZXR0ZXIodGhpcywgJ2FwaScsICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNyZWF0ZTogdGhpcy5jb25maWcuY3JlYXRvciB8fCB0aGlzLmhlbHBlckV4cG9ydC5jcmVhdGUgfHwgZGVmYXVsdENyZWF0ZU1ldGhvZCxcbiAgICAgICAgdmFsaWRhdGU6IHRoaXMuY29uZmlnLnZhbGlkYXRvciB8fCB0aGlzLmhlbHBlckV4cG9ydC52YWxpZGF0ZSB8fCBkZWZhdWx0VmFsaWRhdGVNZXRob2QsXG4gICAgICAgIHJ1bm5lcjogZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgICAgIGN1cnJlbnRIZWxwZXIuYXBpLmRlY29yYXRlKC4uLmFyZ3MpXG4gICAgICAgICAgcmV0dXJuIGN1cnJlbnRIZWxwZXIuYXBpLmNyZWF0ZSguLi5hcmdzKVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLCB0aGlzLmhlbHBlckV4cG9ydC5jb25maWcgfHwge30pLFxuICAgICAgICBkZWNvcmF0ZTogdGhpcy5jb25maWcuZGVjb3JhdG9yIHx8IHRoaXMuaGVscGVyRXhwb3J0LmRlY29yYXRlIHx8IGRlZmF1bHREZWNvcmF0ZU1ldGhvZCxcbiAgICAgICAgZ2VuZXJhdGU6IHRoaXMuY29uZmlnLmdlbmVyYXRvciB8fCB0aGlzLmhlbHBlckV4cG9ydC5nZW5lcmF0ZSB8fCBkZWZhdWx0R2VuZXJhdGVNZXRob2QsXG4gICAgICAgIGFjdGlvbnM6IHRoaXMuY29uZmlnLmFjdGlvbnMgfHwgW11cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgYWN0aW9ucyguLi5hY3Rpb25JZHMpIHtcbiAgICB0aGlzLmNvbmZpZy5hY3Rpb25zID0gdGhpcy5jb25maWcuYWN0aW9ucyB8fCBbXVxuICAgIHRoaXMuY29uZmlnLmFjdGlvbnMucHVzaCguLi5hY3Rpb25JZHMpXG4gIH1cblxuICBnZW5lcmF0b3IoZm4pIHtcbiAgICAgdGhpcy5jb25maWcuZ2VuZXJhdG9yID0gZm5cbiAgfVxuXG4gIGRlY29yYXRvcihmbil7XG4gICAgdGhpcy5jb25maWcuZGVjb3JhdG9yID0gZm5cbiAgfVxuXG4gIGNyZWF0b3IoZm4pe1xuICAgIHRoaXMuY29uZmlnLmNyZWF0b3IgPSBmblxuICB9XG5cbiAgdmFsaWRhdG9yKGZuKXtcbiAgICB0aGlzLmNvbmZpZy52YWxpZGF0b3IgPSBmblxuICB9XG5cblx0Z2V0IGRvY3VtZW50Q29uZmlnICgpIHtcblx0ICByZXR1cm4gdGhpcy5jb25maWcuZG9jdW1lbnRzXG5cdH1cblxuXHRnZXQgc2VjdGlvbnNDb25maWcgKCkge1xuXHQgIHJldHVybiB0aGlzLmRvY3VtZW50Q29uZmlnICYmIHRoaXMuZG9jdW1lbnRDb25maWcuc2VjdGlvbnNDb25maWdcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG4gICAgdGhpcy5ib2R5KHRoaXMpXG4gICAgdGhpcy5kb2N1bWVudHMuY29uZmlndXJlKClcbiAgfVxuXG5cdGNvbmZpZ3VyZURvY3VtZW50cyAoKSB7XG5cdCAgcmV0dXJuIHRoaXMuY29uZmlnLmRvY3VtZW50cyA9IHRoaXMuY29uZmlnLmRvY3VtZW50cyB8fCBuZXcgRG9jdW1lbnRDb25maWd1cmF0aW9uKHRoaXMpXG5cdH1cblxuXHRjb25maWd1cmVEYXRhU291cmNlcyAoKSB7XG5cdCAgcmV0dXJuIHRoaXMuY29uZmlnLmRhdGFfc291cmNlcyA9IHRoaXMuY29uZmlnLmRhdGFfc291cmNlcyB8fCBuZXcgRGF0YVNvdXJjZUNvbmZpZ3VyYXRpb24odGhpcylcblx0fVxufVxuXG5jbGFzcyBEb2N1bWVudENvbmZpZ3VyYXRpb24ge1xuXHRjb25zdHJ1Y3RvciAobW9kZWxEZWZpbml0aW9uKSB7XG4gIGhpZGUuZ2V0dGVyKHRoaXMsICdwYXJlbnQnLCBtb2RlbERlZmluaXRpb24pXG5cbiAgdmFyIHNlY3Rpb25zQ29uZmlnID0ge31cblxuICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGdldCBzZWN0aW9ucyAoKSB7XG4gICAgICAgIHJldHVybiBzZWN0aW9uc0NvbmZpZ1xuICAgICAgfVxuICAgIH1cblxuICBjcmVhdGVDaGFpbk1ldGhvZHModGhpcywgJ2EnLCAnaGFzJywgJ2hhdmUnLCAnbWFueScpXG5cdH1cblxuXHRnZXQgc2VjdGlvbnNDb25maWcgKCkge1xuXHRcdCAgcmV0dXJuIHRoaXMuY29uZmlnLnNlY3Rpb25zXG5cdH1cblxuICBjb25maWd1cmUgKCkge1xuICAgIHZhbHVlcyh0aGlzLmNvbmZpZy5zZWN0aW9ucykuZm9yRWFjaChzZWN0aW9uID0+IHNlY3Rpb24uY29uZmlndXJlKCkpXG4gIH1cblxuICBzZWN0aW9ucyAoZ3JvdXBOYW1lLCBvcHRpb25zID0ge30sIG1hcEZuKSB7XG4gICAgaWYgKCFtYXBGbiAmJiB0eXBlb2YgKG9wdGlvbnMpPT09J2Z1bmN0aW9uJykge1xuICAgICAgIG1hcEZuID0gb3B0aW9uc1xuICAgICAgIG9wdGlvbnMgPSB7fVxuICAgICB9XG5cbiAgICBvcHRpb25zLnR5cGUgPSAnbWFwJ1xuICAgIG9wdGlvbnMucGFyZW50ID0gdGhpc1xuICAgIHRoaXMuY29uZmlnLnNlY3Rpb25zW3VuZGVyc2NvcmUoZ3JvdXBOYW1lKV0gPSBuZXcgU2VjdGlvbkNvbmZpZ3VyYXRpb24oZ3JvdXBOYW1lLCBvcHRpb25zLCBtYXBGbilcbiAgfVxuXG5cdHNlY3Rpb24gKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zID0ge30sIGJ1aWxkRm4pIHtcbiAgaWYgKCFidWlsZEZuICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICAgYnVpbGRGbiA9IG9wdGlvbnNcbiAgICAgICBvcHRpb25zID0ge31cbiAgICAgfVxuXG4gIG9wdGlvbnMudHlwZSA9ICdidWlsZGVyJ1xuICBvcHRpb25zLnBhcmVudCA9IHRoaXNcbiAgdGhpcy5jb25maWcuc2VjdGlvbnNbdW5kZXJzY29yZShzZWN0aW9uSWRlbnRpZmllcildID0gbmV3IFNlY3Rpb25Db25maWd1cmF0aW9uKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zLCBidWlsZEZuKVxuXHR9XG59XG5cbi8qKlxuKiBTZWN0aW9ucyBhcmUgY29uZmlndXJlZCBpbmRpdmlkdWFsbHkgYnkgbmFtZVxuKi9cbmNsYXNzIFNlY3Rpb25Db25maWd1cmF0aW9uIHtcblx0Y29uc3RydWN0b3IgKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zID0ge30sIGJvZHkpIHtcblx0XHQgIHRoaXMubmFtZSA9IHNlY3Rpb25JZGVudGlmaWVyXG5cbiAgaWYgKCFib2R5ICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICBib2R5ID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gIHRoaXMuYm9keSA9IGJvZHkuYmluZCh0aGlzKVxuXHRcdCAgdGhpcy5idWlsZGVyVHlwZSA9IG9wdGlvbnMudHlwZSB8fCAnYnVpbGRlcidcblxuICBsZXQgYXJ0aWNsZXNDb25maWcgPSB7fVxuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIGdldCBhcnRpY2xlcyAoKSB7XG4gICAgICByZXR1cm4gYXJ0aWNsZXNDb25maWdcbiAgICB9XG4gIH1cblxuICBoaWRlLmdldHRlcih0aGlzLCAncGFyZW50Jywgb3B0aW9ucy5wYXJlbnQpXG5cbiAgY3JlYXRlQ2hhaW5NZXRob2RzKHRoaXMsICdhJywgJ2hhcycsICdoYXZlJywgJ21hbnknKVxuXHR9XG5cblx0Z2V0IHNsdWcgKCkge1xuICByZXR1cm4gc2x1Z2lmeSh0aGlzLm5hbWUpXG5cdH1cblxuICBjb25maWd1cmUgKCkge1xuXHQgIHRoaXMuYm9keSh0aGlzKVxuICAgIHZhbHVlcyh0aGlzLmNvbmZpZy5hcnRpY2xlcykuZm9yRWFjaChhcnRpY2xlID0+IGFydGljbGUuY29uZmlndXJlICYmIGFydGljbGUuY29uZmlndXJlKCkpXG4gIH1cblxuICBhcnRpY2xlIChuYW1lLCBvcHRpb25zID0ge30sIGFydGljbGVCdWlsZGVyKSB7XG4gICAgb3B0aW9ucy50eXBlID0gJ2J1aWxkZXInXG4gICAgb3B0aW9ucy5wYXJlbnQgPSB0aGlzXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmFydGljbGVzW3VuZGVyc2NvcmUobmFtZSldID0gbmV3IEFydGljbGVDb25maWd1cmF0aW9uKG5hbWUsIG9wdGlvbnMsIGFydGljbGVCdWlsZGVyKVxuICB9XG5cbiAgYXJ0aWNsZXMgKG5hbWUsIG9wdGlvbnMgPSB7fSwgYXJ0aWNsZUJ1aWxkZXIpIHtcbiAgICBvcHRpb25zLnR5cGUgPSAnbWFwJ1xuICAgIG9wdGlvbnMucGFyZW50ID0gdGhpc1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5hcnRpY2xlc1t1bmRlcnNjb3JlKG5hbWUpXSA9IG5ldyBBcnRpY2xlQ29uZmlndXJhdGlvbihuYW1lLCBvcHRpb25zLCBhcnRpY2xlQnVpbGRlcilcbiAgfVxufVxuXG5jbGFzcyBBcnRpY2xlQ29uZmlndXJhdGlvbiB7XG5cdGNvbnN0cnVjdG9yIChncm91cE5hbWUsIG9wdGlvbnMgPSB7fSwgYm9keSkge1xuXHRcdCAgdGhpcy5uYW1lID0gZ3JvdXBOYW1lXG5cbiAgaWYgKCFib2R5ICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICBib2R5ID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG5cdFx0ICB0aGlzLmJ1aWxkZXJUeXBlID0gb3B0aW9ucy50eXBlIHx8ICdtYXAnXG4gIHRoaXMuYm9keSA9IGJvZHkuYmluZCh0aGlzKVxuXG4gIGNyZWF0ZUNoYWluTWV0aG9kcyh0aGlzLCAnYScsICdoYXMnLCAnaGF2ZScsICdtYW55Jylcblx0fVxuXG5cdGdldCBzbHVnICgpIHtcblx0XHQgIHJldHVybiBzbHVnaWZ5KHRoaXMubmFtZSlcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG5cdFx0ICAgIHRoaXMuYm9keSh0aGlzKVxuICB9XG59XG5cbmNsYXNzIERhdGFTb3VyY2VDb25maWd1cmF0aW9uIHtcblx0Y29uc3RydWN0b3IgKG1vZGVsRGVmaW5pdGlvbikge1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEU0wgKGZuKSB7XG4gIG5vQ29uZmxpY3QoZm4sIERTTCkoKVxufVxuXG5hc3NpZ24oRFNMLCB7XG4gIGFzc2lnbixcbiAgc2luZ3VsYXJpemUsXG4gIHBsdXJhbGl6ZSxcbiAgc2x1Z2lmeSxcbiAgY3VycmVudCxcbiAgdW5kZXJzY29yZSxcbiAgdGFiZWxpemUsXG4gIGxhenksXG4gIGRlc2NyaWJlLFxuICBtb2RlbDogZGVzY3JpYmUsXG4gIGRlZmluZTogZGVzY3JpYmUsXG4gIHZhbGlkYXRlKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLnZhbGlkYXRvciguLi5hcmdzKVxuICB9LFxuICB2YWxpZGF0b3IoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0udmFsaWRhdG9yKC4uLmFyZ3MpXG4gIH0sXG5cbiAgZGVjb3JhdG9yKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLmRlY29yYXRvciguLi5hcmdzKVxuICB9LFxuXG4gIGRlY29yYXRlKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLmRlY29yYXRvciguLi5hcmdzKVxuICB9LFxuXG4gIGNyZWF0b3IoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uY3JlYXRvciguLi5hcmdzKVxuICB9LFxuICBjcmVhdGUoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uY3JlYXRvciguLi5hcmdzKVxuICB9LFxuXG4gIGdlbmVyYXRvciguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS5nZW5lcmF0b3IoLi4uYXJncylcbiAgfSxcblxuICBnZW5lcmF0ZSguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS5nZW5lcmF0b3IoLi4uYXJncylcbiAgfSxcblxuICBhdHRyaWJ1dGVzKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLmF0dHJpYnV0ZXMoLi4uYXJncylcbiAgfSxcblxuICBhY3Rpb25zKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLmFjdGlvbnMoLi4uYXJncylcbiAgfVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2t1cChtb2RlbE5hbWUpIHtcbiAgcmV0dXJuIHRyYWNrZXJbKF9jdXJyID0gdGFiZWxpemUocGFyYW1ldGVyaXplKG1vZGVsTmFtZSkpLnRvTG93ZXJDYXNlKCkpXVxufVxuXG5mdW5jdGlvbiBkZXNjcmliZSAobW9kZWxOYW1lLCBmbikge1xuICBpZighZm4pIHtcbiAgICB0aHJvdygnbW9kZWwgZGVmaW5pdGlvbiBzdGFydGVkIHdpdGggbm8gY29uZmlndXJhdGlvbiBmdW5jdGlvbicpXG4gIH1cblxuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUobW9kZWxOYW1lKSkudG9Mb3dlckNhc2UoKSldID0gbmV3IE1vZGVsRGVmaW5pdGlvbihtb2RlbE5hbWUsIGZuKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbk1ldGhvZHMgKHRhcmdldCwgLi4ubWV0aG9kcykge1xuXHQgIG1ldGhvZHMuZm9yRWFjaChtZXRob2QgPT4ge1xuXHRcdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbWV0aG9kLCB7XG5cdFx0XHQgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdCAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCAgcmV0dXJuIHRhcmdldFxuXHRcdFx0fVxuXHRcdH0pXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDcmVhdGVNZXRob2QgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KXtcbiAgbGV0IGFzc2V0ID0gb3B0aW9ucy5hc3NldCB8fCBvcHRpb25zLmRvY3VtZW50XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogYXNzZXQuaWQsXG4gICAgdXJpOiBhc3NldC51cmksXG4gICAgbWV0YWRhdGE6IGFzc2V0LmRhdGEsXG4gICAgY29udGVudDogYXNzZXQuY29udGVudFxuICB9XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRWYWxpZGF0ZU1ldGhvZCAob3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pe1xuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0R2VuZXJhdGVNZXRob2QgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KXtcbiAgbGV0IHN0ciA9ICcnXG4gIGxldCBmcm9udG1hdHRlciA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMuZGF0YSB8fCB7fSlcbiAgbGV0IGF0dHJzID0gb3B0aW9ucy5hdHRyaWJ1dGVzIHx8IG9wdGlvbnMuYXR0cnMgfHwge31cblxuICBpZiAoT2JqZWN0LmtleXMoZnJvbnRtYXR0ZXIpLmxlbmd0aCA+IDApIHtcbiAgICBzdHIgPSBgLS0tXFxuJHt5YW1sLmR1bXAoZnJvbnRtYXR0ZXIpfS0tLVxcblxcbmBcbiAgfVxuXG4gIGlmIChvcHRpb25zLmNvbnRlbnQpIHtcbiAgICByZXR1cm4gc3RyID0gc3RyICsgYCR7IG9wdGlvbnMuY29udGVudCB9XFxuYFxuICB9XG5cbiAgaWYgKGF0dHJzLnRpdGxlKSB7XG4gICAgc3RyID0gc3RyICsgYCMgJHsgYXR0cnMudGl0bGUgfWBcbiAgfVxuXG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gZGVmYXVsdERlY29yYXRlTWV0aG9kIChvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSl7XG4gIHJldHVybiBbb3B0aW9ucywgY29udGV4dF1cbn1cblxuTW9kZWxEZWZpbml0aW9uLmN1cnJlbnQgPSBjdXJyZW50XG5Nb2RlbERlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uID0gY2xlYXJEZWZpbml0aW9uXG4iXX0=