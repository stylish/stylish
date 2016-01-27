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
        decorate: _this.config.decorator || _this.helperExport.decorate || defaultDecorateMethod
      };
    });
  }

  _createClass(ModelDefinition, [{
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
  attributes: function attributes() {
    var _tracker$_curr7;

    (_tracker$_curr7 = tracker[_curr]).attributes.apply(_tracker$_curr7, arguments);
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

function defaultDecorateMethod() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('DECORATINg!!!');
  return [options, context];
}

ModelDefinition.current = current;
ModelDefinition.clearDefinition = clearDefinition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBNk1nQixHQUFHLEdBQUgsR0FBRztRQTJDSCxNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBdFB0QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBSTtBQUFFLFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7QUFDN0MsU0FBUyxlQUFlLEdBQUk7QUFBRSxPQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FBRTs7SUFFdEQsZUFBZSxXQUFmLGVBQWU7QUFDMUIsV0FEVyxlQUFlLENBQ2IsV0FBVyxFQUFzQjs7O1FBQXBCLE9BQU8seURBQUcsRUFBRTtRQUFFLElBQUk7OzBCQURqQyxlQUFlOztBQUV4QixRQUFJLGlCQUFpQixHQUFHLElBQUksQ0FBQTs7QUFFNUIsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7QUFDOUIsUUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLENBQUE7O0FBRXZCLFFBQUksQ0FBQyxJQUFJLElBQUksT0FBUSxPQUFPLEFBQUMsS0FBRyxVQUFVLEVBQUU7QUFDMUMsVUFBSSxHQUFHLE9BQU8sQ0FBQTtBQUNkLGFBQU8sR0FBRyxFQUFFLENBQUE7S0FDYjs7QUFFRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBOztBQUVoQixRQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUM7QUFDakQsVUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFN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ZmlsZSI6Im1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGFiZWxpemUsIHBsdXJhbGl6ZSwgc2luZ3VsYXJpemUsIHBhcmFtZXRlcml6ZSwgbm9Db25mbGljdCwgYXNzaWduLCBoaWRlLCBsYXp5LCB2YWx1ZXMsIHNsdWdpZnksIHVuZGVyc2NvcmUgfSBmcm9tICcuLi8uLi91dGlsJ1xuXG5sZXQgdHJhY2tlciA9IHsgfVxubGV0IF9jdXJyXG5cbmZ1bmN0aW9uIGN1cnJlbnQgKCkgeyByZXR1cm4gdHJhY2tlcltfY3Vycl0gfVxuZnVuY3Rpb24gY2xlYXJEZWZpbml0aW9uICgpIHsgX2N1cnIgPSBudWxsOyBkZWxldGUgdHJhY2tlcltfY3Vycl0gfVxuXG5leHBvcnQgY2xhc3MgTW9kZWxEZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IgKGRlc2NyaXB0aW9uLCBvcHRpb25zID0ge30sIGJvZHkpIHtcbiAgICBsZXQgY3VycmVudERlZmluaXRpb24gPSB0aGlzXG5cbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb25cbiAgICB0aGlzLm5hbWUgPSBkZXNjcmlwdGlvblxuXG4gICAgaWYgKCFib2R5ICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICBib2R5ID0gb3B0aW9uc1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy5ib2R5ID0gYm9keS5iaW5kKHRoaXMpXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9uc1xuXG4gICAgdGhpcy5jb25maWcgPSB7fVxuXG4gICAgaWYob3B0aW9ucy5yZXF1aXJlZCAmJiBvcHRpb25zLnJlcXVpcmVkLmRlZmluaXRpb24pe1xuICAgICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBvcHRpb25zLnJlcXVpcmVkLmRlZmluaXRpb24pXG4gICAgfVxuXG4gICAgaGlkZS5nZXR0ZXIodGhpcywgJ2RvY3VtZW50cycsIHRoaXMuY29uZmlndXJlRG9jdW1lbnRzLmJpbmQodGhpcykpXG4gICAgaGlkZS5nZXR0ZXIodGhpcywgJ2RhdGFfc291cmNlcycsIHRoaXMuY29uZmlndXJlRGF0YVNvdXJjZXMuYmluZCh0aGlzKSlcblxuICAgIGhpZGUuZ2V0dGVyKHRoaXMsICdhcGknLCAoKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjcmVhdGU6IHRoaXMuY29uZmlnLmNyZWF0b3IgfHwgdGhpcy5oZWxwZXJFeHBvcnQuY3JlYXRlIHx8IGRlZmF1bHRDcmVhdGVNZXRob2QsXG4gICAgICAgIHZhbGlkYXRlOiB0aGlzLmNvbmZpZy52YWxpZGF0b3IgfHwgdGhpcy5oZWxwZXJFeHBvcnQudmFsaWRhdGUgfHwgZGVmYXVsdFZhbGlkYXRlTWV0aG9kLFxuICAgICAgICBydW5uZXI6IGZ1bmN0aW9uKC4uLmFyZ3MpIHtcbiAgICAgICAgICBjdXJyZW50SGVscGVyLmFwaS5kZWNvcmF0ZSguLi5hcmdzKVxuICAgICAgICAgIHJldHVybiBjdXJyZW50SGVscGVyLmFwaS5jcmVhdGUoLi4uYXJncylcbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmNvbmZpZywgdGhpcy5oZWxwZXJFeHBvcnQuY29uZmlnIHx8IHt9KSxcbiAgICAgICAgZGVjb3JhdGU6IHRoaXMuY29uZmlnLmRlY29yYXRvciB8fCB0aGlzLmhlbHBlckV4cG9ydC5kZWNvcmF0ZSB8fCBkZWZhdWx0RGVjb3JhdGVNZXRob2RcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGVjb3JhdG9yKGZuKXtcbiAgICB0aGlzLmNvbmZpZy5kZWNvcmF0b3IgPSBmblxuICB9XG5cbiAgY3JlYXRvcihmbil7XG4gICAgdGhpcy5jb25maWcuY3JlYXRvciA9IGZuXG4gIH1cblxuICB2YWxpZGF0b3IoZm4pe1xuICAgIHRoaXMuY29uZmlnLnZhbGlkYXRvciA9IGZuXG4gIH1cblxuXHRnZXQgZG9jdW1lbnRDb25maWcgKCkge1xuXHQgIHJldHVybiB0aGlzLmNvbmZpZy5kb2N1bWVudHNcblx0fVxuXG5cdGdldCBzZWN0aW9uc0NvbmZpZyAoKSB7XG5cdCAgcmV0dXJuIHRoaXMuZG9jdW1lbnRDb25maWcgJiYgdGhpcy5kb2N1bWVudENvbmZpZy5zZWN0aW9uc0NvbmZpZ1xuXHR9XG5cbiAgY29uZmlndXJlICgpIHtcbiAgICB0aGlzLmJvZHkodGhpcylcbiAgICB0aGlzLmRvY3VtZW50cy5jb25maWd1cmUoKVxuICB9XG5cblx0Y29uZmlndXJlRG9jdW1lbnRzICgpIHtcblx0ICByZXR1cm4gdGhpcy5jb25maWcuZG9jdW1lbnRzID0gdGhpcy5jb25maWcuZG9jdW1lbnRzIHx8IG5ldyBEb2N1bWVudENvbmZpZ3VyYXRpb24odGhpcylcblx0fVxuXG5cdGNvbmZpZ3VyZURhdGFTb3VyY2VzICgpIHtcblx0ICByZXR1cm4gdGhpcy5jb25maWcuZGF0YV9zb3VyY2VzID0gdGhpcy5jb25maWcuZGF0YV9zb3VyY2VzIHx8IG5ldyBEYXRhU291cmNlQ29uZmlndXJhdGlvbih0aGlzKVxuXHR9XG59XG5cbmNsYXNzIERvY3VtZW50Q29uZmlndXJhdGlvbiB7XG5cdGNvbnN0cnVjdG9yIChtb2RlbERlZmluaXRpb24pIHtcbiAgaGlkZS5nZXR0ZXIodGhpcywgJ3BhcmVudCcsIG1vZGVsRGVmaW5pdGlvbilcblxuICB2YXIgc2VjdGlvbnNDb25maWcgPSB7fVxuXG4gIHRoaXMuY29uZmlnID0ge1xuICAgICAgZ2V0IHNlY3Rpb25zICgpIHtcbiAgICAgICAgcmV0dXJuIHNlY3Rpb25zQ29uZmlnXG4gICAgICB9XG4gICAgfVxuXG4gIGNyZWF0ZUNoYWluTWV0aG9kcyh0aGlzLCAnYScsICdoYXMnLCAnaGF2ZScsICdtYW55Jylcblx0fVxuXG5cdGdldCBzZWN0aW9uc0NvbmZpZyAoKSB7XG5cdFx0ICByZXR1cm4gdGhpcy5jb25maWcuc2VjdGlvbnNcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG4gICAgdmFsdWVzKHRoaXMuY29uZmlnLnNlY3Rpb25zKS5mb3JFYWNoKHNlY3Rpb24gPT4gc2VjdGlvbi5jb25maWd1cmUoKSlcbiAgfVxuXG4gIHNlY3Rpb25zIChncm91cE5hbWUsIG9wdGlvbnMgPSB7fSwgbWFwRm4pIHtcbiAgICBpZiAoIW1hcEZuICYmIHR5cGVvZiAob3B0aW9ucyk9PT0nZnVuY3Rpb24nKSB7XG4gICAgICAgbWFwRm4gPSBvcHRpb25zXG4gICAgICAgb3B0aW9ucyA9IHt9XG4gICAgIH1cblxuICAgIG9wdGlvbnMudHlwZSA9ICdtYXAnXG4gICAgb3B0aW9ucy5wYXJlbnQgPSB0aGlzXG4gICAgdGhpcy5jb25maWcuc2VjdGlvbnNbdW5kZXJzY29yZShncm91cE5hbWUpXSA9IG5ldyBTZWN0aW9uQ29uZmlndXJhdGlvbihncm91cE5hbWUsIG9wdGlvbnMsIG1hcEZuKVxuICB9XG5cblx0c2VjdGlvbiAoc2VjdGlvbklkZW50aWZpZXIsIG9wdGlvbnMgPSB7fSwgYnVpbGRGbikge1xuICBpZiAoIWJ1aWxkRm4gJiYgdHlwZW9mIChvcHRpb25zKT09PSdmdW5jdGlvbicpIHtcbiAgICAgICBidWlsZEZuID0gb3B0aW9uc1xuICAgICAgIG9wdGlvbnMgPSB7fVxuICAgICB9XG5cbiAgb3B0aW9ucy50eXBlID0gJ2J1aWxkZXInXG4gIG9wdGlvbnMucGFyZW50ID0gdGhpc1xuICB0aGlzLmNvbmZpZy5zZWN0aW9uc1t1bmRlcnNjb3JlKHNlY3Rpb25JZGVudGlmaWVyKV0gPSBuZXcgU2VjdGlvbkNvbmZpZ3VyYXRpb24oc2VjdGlvbklkZW50aWZpZXIsIG9wdGlvbnMsIGJ1aWxkRm4pXG5cdH1cbn1cblxuLyoqXG4qIFNlY3Rpb25zIGFyZSBjb25maWd1cmVkIGluZGl2aWR1YWxseSBieSBuYW1lXG4qL1xuY2xhc3MgU2VjdGlvbkNvbmZpZ3VyYXRpb24ge1xuXHRjb25zdHJ1Y3RvciAoc2VjdGlvbklkZW50aWZpZXIsIG9wdGlvbnMgPSB7fSwgYm9keSkge1xuXHRcdCAgdGhpcy5uYW1lID0gc2VjdGlvbklkZW50aWZpZXJcblxuICBpZiAoIWJvZHkgJiYgdHlwZW9mIChvcHRpb25zKT09PSdmdW5jdGlvbicpIHtcbiAgICAgIGJvZHkgPSBvcHRpb25zXG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgdGhpcy5ib2R5ID0gYm9keS5iaW5kKHRoaXMpXG5cdFx0ICB0aGlzLmJ1aWxkZXJUeXBlID0gb3B0aW9ucy50eXBlIHx8ICdidWlsZGVyJ1xuXG4gIGxldCBhcnRpY2xlc0NvbmZpZyA9IHt9XG5cbiAgdGhpcy5jb25maWcgPSB7XG4gICAgZ2V0IGFydGljbGVzICgpIHtcbiAgICAgIHJldHVybiBhcnRpY2xlc0NvbmZpZ1xuICAgIH1cbiAgfVxuXG4gIGhpZGUuZ2V0dGVyKHRoaXMsICdwYXJlbnQnLCBvcHRpb25zLnBhcmVudClcblxuICBjcmVhdGVDaGFpbk1ldGhvZHModGhpcywgJ2EnLCAnaGFzJywgJ2hhdmUnLCAnbWFueScpXG5cdH1cblxuXHRnZXQgc2x1ZyAoKSB7XG4gIHJldHVybiBzbHVnaWZ5KHRoaXMubmFtZSlcblx0fVxuXG4gIGNvbmZpZ3VyZSAoKSB7XG5cdCAgdGhpcy5ib2R5KHRoaXMpXG4gICAgdmFsdWVzKHRoaXMuY29uZmlnLmFydGljbGVzKS5mb3JFYWNoKGFydGljbGUgPT4gYXJ0aWNsZS5jb25maWd1cmUgJiYgYXJ0aWNsZS5jb25maWd1cmUoKSlcbiAgfVxuXG4gIGFydGljbGUgKG5hbWUsIG9wdGlvbnMgPSB7fSwgYXJ0aWNsZUJ1aWxkZXIpIHtcbiAgICBvcHRpb25zLnR5cGUgPSAnYnVpbGRlcidcbiAgICBvcHRpb25zLnBhcmVudCA9IHRoaXNcbiAgICByZXR1cm4gdGhpcy5jb25maWcuYXJ0aWNsZXNbdW5kZXJzY29yZShuYW1lKV0gPSBuZXcgQXJ0aWNsZUNvbmZpZ3VyYXRpb24obmFtZSwgb3B0aW9ucywgYXJ0aWNsZUJ1aWxkZXIpXG4gIH1cblxuICBhcnRpY2xlcyAobmFtZSwgb3B0aW9ucyA9IHt9LCBhcnRpY2xlQnVpbGRlcikge1xuICAgIG9wdGlvbnMudHlwZSA9ICdtYXAnXG4gICAgb3B0aW9ucy5wYXJlbnQgPSB0aGlzXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLmFydGljbGVzW3VuZGVyc2NvcmUobmFtZSldID0gbmV3IEFydGljbGVDb25maWd1cmF0aW9uKG5hbWUsIG9wdGlvbnMsIGFydGljbGVCdWlsZGVyKVxuICB9XG59XG5cbmNsYXNzIEFydGljbGVDb25maWd1cmF0aW9uIHtcblx0Y29uc3RydWN0b3IgKGdyb3VwTmFtZSwgb3B0aW9ucyA9IHt9LCBib2R5KSB7XG5cdFx0ICB0aGlzLm5hbWUgPSBncm91cE5hbWVcblxuICBpZiAoIWJvZHkgJiYgdHlwZW9mIChvcHRpb25zKT09PSdmdW5jdGlvbicpIHtcbiAgICAgIGJvZHkgPSBvcHRpb25zXG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cblx0XHQgIHRoaXMuYnVpbGRlclR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ21hcCdcbiAgdGhpcy5ib2R5ID0gYm9keS5iaW5kKHRoaXMpXG5cbiAgY3JlYXRlQ2hhaW5NZXRob2RzKHRoaXMsICdhJywgJ2hhcycsICdoYXZlJywgJ21hbnknKVxuXHR9XG5cblx0Z2V0IHNsdWcgKCkge1xuXHRcdCAgcmV0dXJuIHNsdWdpZnkodGhpcy5uYW1lKVxuXHR9XG5cbiAgY29uZmlndXJlICgpIHtcblx0XHQgICAgdGhpcy5ib2R5KHRoaXMpXG4gIH1cbn1cblxuY2xhc3MgRGF0YVNvdXJjZUNvbmZpZ3VyYXRpb24ge1xuXHRjb25zdHJ1Y3RvciAobW9kZWxEZWZpbml0aW9uKSB7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIERTTCAoZm4pIHtcbiAgbm9Db25mbGljdChmbiwgRFNMKSgpXG59XG5cbmFzc2lnbihEU0wsIHtcbiAgYXNzaWduLFxuICBzaW5ndWxhcml6ZSxcbiAgcGx1cmFsaXplLFxuICBzbHVnaWZ5LFxuICBjdXJyZW50LFxuICB1bmRlcnNjb3JlLFxuICB0YWJlbGl6ZSxcbiAgbGF6eSxcbiAgZGVzY3JpYmUsXG4gIG1vZGVsOiBkZXNjcmliZSxcbiAgZGVmaW5lOiBkZXNjcmliZSxcbiAgdmFsaWRhdGUoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0udmFsaWRhdG9yKC4uLmFyZ3MpXG4gIH0sXG4gIHZhbGlkYXRvciguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS52YWxpZGF0b3IoLi4uYXJncylcbiAgfSxcblxuICBkZWNvcmF0b3IoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uZGVjb3JhdG9yKC4uLmFyZ3MpXG4gIH0sXG5cbiAgZGVjb3JhdGUoLi4uYXJncyl7XG4gICAgdHJhY2tlcltfY3Vycl0uZGVjb3JhdG9yKC4uLmFyZ3MpXG4gIH0sXG5cbiAgY3JlYXRvciguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS5jcmVhdG9yKC4uLmFyZ3MpXG4gIH0sXG4gIGNyZWF0ZSguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS5jcmVhdG9yKC4uLmFyZ3MpXG4gIH0sXG5cbiAgYXR0cmlidXRlcyguLi5hcmdzKXtcbiAgICB0cmFja2VyW19jdXJyXS5hdHRyaWJ1dGVzKC4uLmFyZ3MpXG4gIH1cbn0pXG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAobW9kZWxOYW1lKSB7XG4gIHJldHVybiB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShtb2RlbE5hbWUpKS50b0xvd2VyQ2FzZSgpKV1cbn1cblxuZnVuY3Rpb24gZGVzY3JpYmUgKG1vZGVsTmFtZSwgZm4pIHtcbiAgaWYoIWZuKSB7XG4gICAgdGhyb3coJ21vZGVsIGRlZmluaXRpb24gc3RhcnRlZCB3aXRoIG5vIGNvbmZpZ3VyYXRpb24gZnVuY3Rpb24nKVxuICB9XG5cbiAgcmV0dXJuIHRyYWNrZXJbKF9jdXJyID0gdGFiZWxpemUocGFyYW1ldGVyaXplKG1vZGVsTmFtZSkpLnRvTG93ZXJDYXNlKCkpXSA9IG5ldyBNb2RlbERlZmluaXRpb24obW9kZWxOYW1lLCBmbilcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ2hhaW5NZXRob2RzICh0YXJnZXQsIC4uLm1ldGhvZHMpIHtcblx0ICBtZXRob2RzLmZvckVhY2gobWV0aG9kID0+IHtcblx0XHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG1ldGhvZCwge1xuXHRcdFx0ICBjb25maWd1cmFibGU6IHRydWUsXG5cdFx0XHQgIGdldDogZnVuY3Rpb24gKCkge1xuXHRcdFx0XHQgIHJldHVybiB0YXJnZXRcblx0XHRcdH1cblx0XHR9KVxuXHR9KVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q3JlYXRlTWV0aG9kIChvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSl7XG4gIGxldCBhc3NldCA9IG9wdGlvbnMuYXNzZXQgfHwgb3B0aW9ucy5kb2N1bWVudFxuXG4gIHJldHVybiB7XG4gICAgaWQ6IGFzc2V0LmlkLFxuICAgIHVyaTogYXNzZXQudXJpLFxuICAgIG1ldGFkYXRhOiBhc3NldC5kYXRhLFxuICAgIGNvbnRlbnQ6IGFzc2V0LmNvbnRlbnRcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWZhdWx0VmFsaWRhdGVNZXRob2QgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KXtcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gZGVmYXVsdERlY29yYXRlTWV0aG9kIChvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSl7XG4gIGNvbnNvbGUubG9nKCdERUNPUkFUSU5nISEhJylcbiAgcmV0dXJuIFtvcHRpb25zLCBjb250ZXh0XVxufVxuXG5Nb2RlbERlZmluaXRpb24uY3VycmVudCA9IGN1cnJlbnRcbk1vZGVsRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24gPSBjbGVhckRlZmluaXRpb25cbiJdfQ==