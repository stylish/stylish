'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModelDefinition = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.DSL = DSL;
exports.lookup = lookup;

var _jsYaml = require('js-yaml');

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    (0, _classCallCheck3.default)(this, ModelDefinition);

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
      this.config = (0, _util.assign)(this.config, options.required.definition);
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
        config: (0, _util.assign)({}, _this.config, _this.helperExport.config || {}),
        decorate: _this.config.decorator || _this.helperExport.decorate || defaultDecorateMethod,
        generate: _this.config.generator || _this.helperExport.generate || defaultGenerateMethod,
        actions: _this.config.actions || []
      };
    });
  }

  (0, _createClass3.default)(ModelDefinition, [{
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
      var helpers = function helpers(def) {
        return {
          example: function example() {},
          paragraphs: function paragraphs() {},
          h1: function h1() {},
          h2: function h2() {},
          h3: function h3() {}
        };
      };

      this.body(this, helpers(this));
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
    (0, _classCallCheck3.default)(this, DocumentConfiguration);

    _util.hide.getter(this, 'parent', modelDefinition);

    var sectionsConfig = {};

    this.config = {
      get sections() {
        return sectionsConfig;
      }
    };

    createChainMethods(this, 'a', 'has', 'have', 'many');
  }

  (0, _createClass3.default)(DocumentConfiguration, [{
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
    (0, _classCallCheck3.default)(this, SectionConfiguration);

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

  (0, _createClass3.default)(SectionConfiguration, [{
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
    (0, _classCallCheck3.default)(this, ArticleConfiguration);

    this.name = groupName;

    if (!body && typeof options === 'function') {
      body = options;
      options = {};
    }

    this.builderType = options.type || 'map';
    this.body = body.bind(this);

    createChainMethods(this, 'a', 'has', 'have', 'many');
  }

  (0, _createClass3.default)(ArticleConfiguration, [{
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
  (0, _classCallCheck3.default)(this, DataSourceConfiguration);
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
    (0, _defineProperty2.default)(target, method, {
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
  var frontmatter = (0, _util.assign)({}, options.data || {});
  var attrs = options.attributes || options.attrs || {};

  if ((0, _keys2.default)(frontmatter).length > 0) {
    str = '---\n' + (0, _jsYaml.dump)(frontmatter) + '---\n\n';
  }

  if (attrs.title) {
    str = str + ('# ' + attrs.title + '\n\n');
  }

  if (options.content) {
    str = str + (options.content + '\n');
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