'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

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
        runner: _this.config.creator || _this.helperExport.create || defaultCreateMethod,
        config: Object.assign({}, _this.config, _this.helperExport.config || {})
      };
    });
  }

  _createClass(ModelDefinition, [{
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
  creator: function creator() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).creator.apply(_tracker$_curr3, arguments);
  },
  create: function create() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).creator.apply(_tracker$_curr4, arguments);
  },
  attributes: function attributes() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).attributes.apply(_tracker$_curr5, arguments);
  }
});

function lookup(modelName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(modelName)).toLowerCase()];
}

function describe(modelName, fn) {
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

function defaultCreateMethod(asset) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return {
    id: asset.id,
    uri: asset.uri,
    metadata: asset.data,
    content: asset.content.toJSON()
  };
}

function defaultValidateMethod(asset) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return true;
}

ModelDefinition.current = current;
ModelDefinition.clearDefinition = clearDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBbU1nQixHQUFHLEdBQUgsR0FBRztRQWlDSCxNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBbE90QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBSTtBQUFFLFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7QUFDN0MsU0FBUyxlQUFlLEdBQUk7QUFBRSxPQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FBRTs7SUFFdEQsZUFBZSxXQUFmLGVBQWU7QUFDMUIsV0FEVyxlQUFlLENBQ2IsV0FBVyxFQUFzQjs7O1FBQXBCLE9BQU8seURBQUcsRUFBRTtRQUFFLElBQUk7OzBCQURqQyxlQUFlOztBQUV4QixRQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQTtBQUM5QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTs7QUFFdkIsUUFBSSxDQUFDLElBQUksSUFBSSxPQUFRLE9BQU8sQUFBQyxLQUFHLFVBQVUsRUFBRTtBQUMxQyxVQUFJLEdBQUcsT0FBTyxDQUFBO0FBQ2QsYUFBTyxHQUFHLEVBQUUsQ0FBQTtLQUNiOztBQUVELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMzQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTs7QUFFdEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUE7O0FBRWhCLFFBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsRUFBQztBQUNqRCxVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFB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TyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO0dBQ2hDLENBQUE7Q0FDRjs7QUFFRCxTQUFTLHFCQUFxQixDQUFDLEtBQUssRUFBZTtNQUFiLE9BQU8seURBQUcsRUFBRTs7QUFDaEQsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFRCxlQUFlLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUNqQyxlQUFlLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQSIsImZpbGUiOiJtb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRhYmVsaXplLCBwbHVyYWxpemUsIHNpbmd1bGFyaXplLCBwYXJhbWV0ZXJpemUsIG5vQ29uZmxpY3QsIGFzc2lnbiwgaGlkZSwgbGF6eSwgdmFsdWVzLCBzbHVnaWZ5LCB1bmRlcnNjb3JlIH0gZnJvbSAnLi4vLi4vdXRpbCdcblxubGV0IHRyYWNrZXIgPSB7IH1cbmxldCBfY3VyclxuXG5mdW5jdGlvbiBjdXJyZW50ICgpIHsgcmV0dXJuIHRyYWNrZXJbX2N1cnJdIH1cbmZ1bmN0aW9uIGNsZWFyRGVmaW5pdGlvbiAoKSB7IF9jdXJyID0gbnVsbDsgZGVsZXRlIHRyYWNrZXJbX2N1cnJdIH1cblxuZXhwb3J0IGNsYXNzIE1vZGVsRGVmaW5pdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChkZXNjcmlwdGlvbiwgb3B0aW9ucyA9IHt9LCBib2R5KSB7XG4gICAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uXG4gICAgdGhpcy5uYW1lID0gZGVzY3JpcHRpb25cblxuICAgIGlmICghYm9keSAmJiB0eXBlb2YgKG9wdGlvbnMpPT09J2Z1bmN0aW9uJykge1xuICAgICAgYm9keSA9IG9wdGlvbnNcbiAgICAgIG9wdGlvbnMgPSB7fVxuICAgIH1cblxuICAgIHRoaXMuYm9keSA9IGJvZHkuYmluZCh0aGlzKVxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnNcblxuICAgIHRoaXMuY29uZmlnID0ge31cblxuICAgIGlmKG9wdGlvbnMucmVxdWlyZWQgJiYgb3B0aW9ucy5yZXF1aXJlZC5kZWZpbml0aW9uKXtcbiAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgb3B0aW9ucy5yZXF1aXJlZC5kZWZpbml0aW9uKVxuICAgIH1cblxuICAgIGhpZGUuZ2V0dGVyKHRoaXMsICdkb2N1bWVudHMnLCB0aGlzLmNvbmZpZ3VyZURvY3VtZW50cy5iaW5kKHRoaXMpKVxuICAgIGhpZGUuZ2V0dGVyKHRoaXMsICdkYXRhX3NvdXJjZXMnLCB0aGlzLmNvbmZpZ3VyZURhdGFTb3VyY2VzLmJpbmQodGhpcykpXG5cbiAgICBoaWRlLmdldHRlcih0aGlzLCAnYXBpJywgKCkgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY3JlYXRlOiB0aGlzLmNvbmZpZy5jcmVhdG9yIHx8IHRoaXMuaGVscGVyRXhwb3J0LmNyZWF0ZSB8fCBkZWZhdWx0Q3JlYXRlTWV0aG9kLFxuICAgICAgICB2YWxpZGF0ZTogdGhpcy5jb25maWcudmFsaWRhdG9yIHx8IHRoaXMuaGVscGVyRXhwb3J0LnZhbGlkYXRlIHx8IGRlZmF1bHRWYWxpZGF0ZU1ldGhvZCxcbiAgICAgICAgcnVubmVyOiB0aGlzLmNvbmZpZy5jcmVhdG9yIHx8IHRoaXMuaGVscGVyRXhwb3J0LmNyZWF0ZSB8fCBkZWZhdWx0Q3JlYXRlTWV0aG9kLFxuICAgICAgICBjb25maWc6IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY29uZmlnLCB0aGlzLmhlbHBlckV4cG9ydC5jb25maWcgfHwge30pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNyZWF0b3IoZm4pe1xuICAgIHRoaXMuY29uZmlnLmNyZWF0b3IgPSBmblxuICB9XG5cbiAgdmFsaWRhdG9yKGZuKXtcbiAgICB0aGlzLmNvbmZpZy52YWxpZGF0b3IgPSBmblxuICB9XG5cblx0Z2V0IGRvY3VtZW50Q29uZmlnICgpIHtcblx0ICByZXR1cm4gdGhpcy5jb25maWcuZG9jdW1lbnRzXG5cdH1cblxuXHRnZXQgc2VjdGlvbnNDb25maWcgKCkge1xuXHQgIHJldHVybiB0aGlzLmRvY3VtZW50Q29uZmlnICYmIHRoaXMuZG9jdW1lbnRDb25maWcuc2VjdGlvbnNDb25maWdcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG4gICAgdGhpcy5ib2R5KHRoaXMpXG4gICAgdGhpcy5kb2N1bWVudHMuY29uZmlndXJlKClcbiAgfVxuXG5cdGNvbmZpZ3VyZURvY3VtZW50cyAoKSB7XG5cdCAgcmV0dXJuIHRoaXMuY29uZmlnLmRvY3VtZW50cyA9IHRoaXMuY29uZmlnLmRvY3VtZW50cyB8fCBuZXcgRG9jdW1lbnRDb25maWd1cmF0aW9uKHRoaXMpXG5cdH1cblxuXHRjb25maWd1cmVEYXRhU291cmNlcyAoKSB7XG5cdCAgcmV0dXJuIHRoaXMuY29uZmlnLmRhdGFfc291cmNlcyA9IHRoaXMuY29uZmlnLmRhdGFfc291cmNlcyB8fCBuZXcgRGF0YVNvdXJjZUNvbmZpZ3VyYXRpb24odGhpcylcblx0fVxufVxuXG5jbGFzcyBEb2N1bWVudENvbmZpZ3VyYXRpb24ge1xuXHRjb25zdHJ1Y3RvciAobW9kZWxEZWZpbml0aW9uKSB7XG4gIGhpZGUuZ2V0dGVyKHRoaXMsICdwYXJlbnQnLCBtb2RlbERlZmluaXRpb24pXG5cbiAgdmFyIHNlY3Rpb25zQ29uZmlnID0ge31cblxuICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGdldCBzZWN0aW9ucyAoKSB7XG4gICAgICAgIHJldHVybiBzZWN0aW9uc0NvbmZpZ1xuICAgICAgfVxuICAgIH1cblxuICBjcmVhdGVDaGFpbk1ldGhvZHModGhpcywgJ2EnLCAnaGFzJywgJ2hhdmUnLCAnbWFueScpXG5cdH1cblxuXHRnZXQgc2VjdGlvbnNDb25maWcgKCkge1xuXHRcdCAgcmV0dXJuIHRoaXMuY29uZmlnLnNlY3Rpb25zXG5cdH1cblxuICBjb25maWd1cmUgKCkge1xuICAgIHZhbHVlcyh0aGlzLmNvbmZpZy5zZWN0aW9ucykuZm9yRWFjaChzZWN0aW9uID0+IHNlY3Rpb24uY29uZmlndXJlKCkpXG4gIH1cblxuICBzZWN0aW9ucyAoZ3JvdXBOYW1lLCBvcHRpb25zID0ge30sIG1hcEZuKSB7XG4gICAgaWYgKCFtYXBGbiAmJiB0eXBlb2YgKG9wdGlvbnMpPT09J2Z1bmN0aW9uJykge1xuICAgICAgIG1hcEZuID0gb3B0aW9uc1xuICAgICAgIG9wdGlvbnMgPSB7fVxuICAgICB9XG5cbiAgICBvcHRpb25zLnR5cGUgPSAnbWFwJ1xuICAgIG9wdGlvbnMucGFyZW50ID0gdGhpc1xuICAgIHRoaXMuY29uZmlnLnNlY3Rpb25zW3VuZGVyc2NvcmUoZ3JvdXBOYW1lKV0gPSBuZXcgU2VjdGlvbkNvbmZpZ3VyYXRpb24oZ3JvdXBOYW1lLCBvcHRpb25zLCBtYXBGbilcbiAgfVxuXG5cdHNlY3Rpb24gKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zID0ge30sIGJ1aWxkRm4pIHtcbiAgaWYgKCFidWlsZEZuICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICAgYnVpbGRGbiA9IG9wdGlvbnNcbiAgICAgICBvcHRpb25zID0ge31cbiAgICAgfVxuXG4gIG9wdGlvbnMudHlwZSA9ICdidWlsZGVyJ1xuICBvcHRpb25zLnBhcmVudCA9IHRoaXNcbiAgdGhpcy5jb25maWcuc2VjdGlvbnNbdW5kZXJzY29yZShzZWN0aW9uSWRlbnRpZmllcildID0gbmV3IFNlY3Rpb25Db25maWd1cmF0aW9uKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zLCBidWlsZEZuKVxuXHR9XG59XG5cbi8qKlxuKiBTZWN0aW9ucyBhcmUgY29uZmlndXJlZCBpbmRpdmlkdWFsbHkgYnkgbmFtZVxuKi9cbmNsYXNzIFNlY3Rpb25Db25maWd1cmF0aW9uIHtcblx0Y29uc3RydWN0b3IgKHNlY3Rpb25JZGVudGlmaWVyLCBvcHRpb25zID0ge30sIGJvZHkpIHtcblx0XHQgIHRoaXMubmFtZSA9IHNlY3Rpb25JZGVudGlmaWVyXG5cbiAgaWYgKCFib2R5ICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICBib2R5ID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gIHRoaXMuYm9keSA9IGJvZHkuYmluZCh0aGlzKVxuXHRcdCAgdGhpcy5idWlsZGVyVHlwZSA9IG9wdGlvbnMudHlwZSB8fCAnYnVpbGRlcidcblxuICBsZXQgYXJ0aWNsZXNDb25maWcgPSB7fVxuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgIGdldCBhcnRpY2xlcyAoKSB7XG4gICAgICByZXR1cm4gYXJ0aWNsZXNDb25maWdcbiAgICB9XG4gIH1cblxuICBoaWRlLmdldHRlcih0aGlzLCAncGFyZW50Jywgb3B0aW9ucy5wYXJlbnQpXG5cbiAgY3JlYXRlQ2hhaW5NZXRob2RzKHRoaXMsICdhJywgJ2hhcycsICdoYXZlJywgJ21hbnknKVxuXHR9XG5cblx0Z2V0IHNsdWcgKCkge1xuICByZXR1cm4gc2x1Z2lmeSh0aGlzLm5hbWUpXG5cdH1cblxuICBjb25maWd1cmUgKCkge1xuXHQgIHRoaXMuYm9keSh0aGlzKVxuICAgIHZhbHVlcyh0aGlzLmNvbmZpZy5hcnRpY2xlcykuZm9yRWFjaChhcnRpY2xlID0+IGFydGljbGUuY29uZmlndXJlICYmIGFydGljbGUuY29uZmlndXJlKCkpXG4gIH1cblxuICBhcnRpY2xlIChuYW1lLCBvcHRpb25zID0ge30sIGFydGljbGVCdWlsZGVyKSB7XG4gICAgb3B0aW9ucy50eXBlID0gJ2J1aWxkZXInXG4gICAgb3B0aW9ucy5wYXJlbnQgPSB0aGlzXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmFydGljbGVzW3VuZGVyc2NvcmUobmFtZSldID0gbmV3IEFydGljbGVDb25maWd1cmF0aW9uKG5hbWUsIG9wdGlvbnMsIGFydGljbGVCdWlsZGVyKVxuICB9XG5cbiAgYXJ0aWNsZXMgKG5hbWUsIG9wdGlvbnMgPSB7fSwgYXJ0aWNsZUJ1aWxkZXIpIHtcbiAgICBvcHRpb25zLnR5cGUgPSAnbWFwJ1xuICAgIG9wdGlvbnMucGFyZW50ID0gdGhpc1xuICAgIHJldHVybiB0aGlzLmNvbmZpZy5hcnRpY2xlc1t1bmRlcnNjb3JlKG5hbWUpXSA9IG5ldyBBcnRpY2xlQ29uZmlndXJhdGlvbihuYW1lLCBvcHRpb25zLCBhcnRpY2xlQnVpbGRlcilcbiAgfVxufVxuXG5jbGFzcyBBcnRpY2xlQ29uZmlndXJhdGlvbiB7XG5cdGNvbnN0cnVjdG9yIChncm91cE5hbWUsIG9wdGlvbnMgPSB7fSwgYm9keSkge1xuXHRcdCAgdGhpcy5uYW1lID0gZ3JvdXBOYW1lXG5cbiAgaWYgKCFib2R5ICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICBib2R5ID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG5cdFx0ICB0aGlzLmJ1aWxkZXJUeXBlID0gb3B0aW9ucy50eXBlIHx8ICdtYXAnXG4gIHRoaXMuYm9keSA9IGJvZHkuYmluZCh0aGlzKVxuXG4gIGNyZWF0ZUNoYWluTWV0aG9kcyh0aGlzLCAnYScsICdoYXMnLCAnaGF2ZScsICdtYW55Jylcblx0fVxuXG5cdGdldCBzbHVnICgpIHtcblx0XHQgIHJldHVybiBzbHVnaWZ5KHRoaXMubmFtZSlcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG5cdFx0ICAgIHRoaXMuYm9keSh0aGlzKVxuICB9XG59XG5cbmNsYXNzIERhdGFTb3VyY2VDb25maWd1cmF0aW9uIHtcblx0Y29uc3RydWN0b3IgKG1vZGVsRGVmaW5pdGlvbikge1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBEU0wgKGZuKSB7XG4gIG5vQ29uZmxpY3QoZm4sIERTTCkoKVxufVxuXG5hc3NpZ24oRFNMLCB7XG4gIGFzc2lnbixcbiAgc2luZ3VsYXJpemUsXG4gIHBsdXJhbGl6ZSxcbiAgc2x1Z2lmeSxcbiAgY3VycmVudCxcbiAgdW5kZXJzY29yZSxcbiAgdGFiZWxpemUsXG4gIGxhenksXG4gIGRlc2NyaWJlLFxuICBtb2RlbDogZGVzY3JpYmUsXG4gIGRlZmluZTogZGVzY3JpYmUsXG4gIHZhbGlkYXRlKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLnZhbGlkYXRvciguLi5hcmdzKVxuICB9LFxuICB2YWxpZGF0b3IoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0udmFsaWRhdG9yKC4uLmFyZ3MpXG4gIH0sXG4gIGNyZWF0b3IoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uY3JlYXRvciguLi5hcmdzKVxuICB9LFxuICBjcmVhdGUoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uY3JlYXRvciguLi5hcmdzKVxuICB9LFxuICBhdHRyaWJ1dGVzKC4uLmFyZ3Mpe1xuICAgIHRyYWNrZXJbX2N1cnJdLmF0dHJpYnV0ZXMoLi4uYXJncylcbiAgfVxufSlcblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2t1cChtb2RlbE5hbWUpIHtcbiAgcmV0dXJuIHRyYWNrZXJbKF9jdXJyID0gdGFiZWxpemUocGFyYW1ldGVyaXplKG1vZGVsTmFtZSkpLnRvTG93ZXJDYXNlKCkpXVxufVxuXG5mdW5jdGlvbiBkZXNjcmliZSAobW9kZWxOYW1lLCBmbikge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUobW9kZWxOYW1lKSkudG9Mb3dlckNhc2UoKSldID0gbmV3IE1vZGVsRGVmaW5pdGlvbihtb2RlbE5hbWUsIGZuKVxufVxuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbk1ldGhvZHMgKHRhcmdldCwgLi4ubWV0aG9kcykge1xuXHQgIG1ldGhvZHMuZm9yRWFjaChtZXRob2QgPT4ge1xuXHRcdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbWV0aG9kLCB7XG5cdFx0XHQgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcblx0XHRcdCAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdCAgcmV0dXJuIHRhcmdldFxuXHRcdFx0fVxuXHRcdH0pXG5cdH0pXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDcmVhdGVNZXRob2QoYXNzZXQsIG9wdGlvbnMgPSB7fSl7XG4gIHJldHVybiB7XG4gICAgaWQ6IGFzc2V0LmlkLFxuICAgIHVyaTogYXNzZXQudXJpLFxuICAgIG1ldGFkYXRhOiBhc3NldC5kYXRhLFxuICAgIGNvbnRlbnQ6IGFzc2V0LmNvbnRlbnQudG9KU09OKClcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0VmFsaWRhdGVNZXRob2QoYXNzZXQsIG9wdGlvbnMgPSB7fSl7XG4gIHJldHVybiB0cnVlXG59XG5cbk1vZGVsRGVmaW5pdGlvbi5jdXJyZW50ID0gY3VycmVudFxuTW9kZWxEZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbiA9IGNsZWFyRGVmaW5pdGlvblxuIl19