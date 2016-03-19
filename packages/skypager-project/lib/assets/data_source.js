'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataSource = undefined;

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

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

var util = _interopRequireWildcard(_util);

var _result2 = require('lodash/result');

var _result3 = _interopRequireDefault(_result2);

var _set2 = require('lodash/set');

var _set3 = _interopRequireDefault(_set2);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clone = util.clone;
var _pick = util.pick;
var _result = util.result;
var noConflict = util.noConflict;

var EXTENSIONS = ['js', 'json', 'yaml', 'yml', 'csv'];
var GLOB = '**/*.{' + EXTENSIONS.join(',') + '}';

var DataSource = exports.DataSource = (function (_Asset) {
  (0, _inherits3.default)(DataSource, _Asset);

  function DataSource(uri) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, DataSource);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DataSource).call(this, uri, options));

    _this.lazy('parsed', function () {
      return _this.parse(_this.raw);
    });
    _this.lazy('indexed', function () {
      return _this.index(_this.parsed, _this);
    });
    _this.lazy('transformed', function () {
      return _this.transform(_this.indexed, _this);
    });
    _this.lazy('data', _this.getData, true);

    _this.indexer = options.indexer || function (val) {
      return val;
    };
    _this.transformer = options.transformer || function (val) {
      return val;
    };
    return _this;
  }

  (0, _createClass3.default)(DataSource, [{
    key: 'defaults',
    value: function defaults() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _defaultsDeep2.default.apply(undefined, [this.data].concat(args));
    }
  }, {
    key: 'pick',
    value: function pick() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _pick.apply(undefined, [this.data].concat(args));
    }
  }, {
    key: 'get',
    value: function get() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return _result3.default.apply(undefined, [this.data].concat(args));
    }
  }, {
    key: '_get',
    value: function _get() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return _result3.default.apply(undefined, [this].concat(args));
    }
  }, {
    key: 'update',
    value: function update() {
      return this.set.apply(this, arguments).save();
    }
  }, {
    key: 'saveSync',
    value: function saveSync() {
      return this.set.apply(this, arguments).save();
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      var _this2 = this;

      if (!value && (0, _isObject2.default)(key)) {
        (0, _keys2.default)(key).forEach(function (k) {
          _this2.set(k, key[k]);
        });
        return this;
      }

      if ((0, _isString2.default)(key)) {
        (0, _set3.default)(this.data, key, value);
      }

      return this;
    }
  }, {
    key: 'result',
    value: function result() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _result.apply(undefined, [this.data].concat(args));
    }
  }, {
    key: 'getData',
    value: function getData() {
      if (this.extension !== '.js' && (!this.raw || this.raw.length === 0)) {
        this.runImporter('disk', { asset: this, sync: true });
      }

      return this.indexed;
    }
  }, {
    key: 'saveSync',
    value: function saveSync() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.raw || this.raw.length === 0) {
        if (!options.allowEmpty && (0, _isEmpty2.default)(this.data)) {
          return false;
        }
      }

      if (this.extension === '.json') {
        this.raw = !options.minify ? (0, _stringify2.default)(this.data, null, 2) : (0, _stringify2.default)(this.data);
      } else if (this.extension === '.yml') {
        this.raw = require('yaml').dump(this.data);
      }

      return require('fs').writeFileSync(this.paths.absolute, this.raw, 'utf8');
    }
  }, {
    key: 'save',
    value: function save() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.raw || this.raw.length === 0) {
        if (!options.allowEmpty && (0, _isEmpty2.default)(this.data)) {
          return false;
        }
      }

      if (this.extension === '.json') {
        this.raw = !options.minify ? (0, _stringify2.default)(this.data, null, 2) : (0, _stringify2.default)(this.data);
      } else if (this.extension === '.yml') {
        this.raw = require('yaml').dump(this.data);
      }

      return require('fs-promise').writeFile(this.paths.absolute, this.raw, 'utf8');
    }
  }, {
    key: 'parser',
    value: function parser(content, asset) {
      var _this3 = this;

      content = content || this.raw || '';

      if (this.extension === '.js') {
        return handleScript.call(this, this, function () {
          return require(_this3.paths.absolute);
        });
      } else if (this.extension === '.json') {
        return JSON.parse(content || '{}');
      } else if (this.extension === '.yml') {
        return require('js-yaml').safeLoad(content || '');
      } else if (this.extension === '.csv') {
        return [];
      } else {

        throw 'Implement parser for ' + this.extension + ' ' + content.length;
      }
    }
  }]);
  return DataSource;
})(_asset2.default);

DataSource.EXTENSIONS = EXTENSIONS;
DataSource.GLOB = GLOB;
exports.default = DataSource;

function handleScript(datasource, load) {
  var locals = {
    util: util,
    datasource: datasource,
    project: datasource.project
  };

  return noConflict(function () {
    var exp = load();

    if (typeof exp === 'function') {
      return exp.call(datasource, datasource, datasource.project);
    } else {
      return exp;
    }
  }, locals)();
}

function interpolateValues(obj, template) {
  var datasource = this;

  (0, _keys2.default)(obj).forEach(function (key) {
    var value = obj[key];

    if ((typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object') {
      interpolateValues.call(datasource, value, template);
    } else if (typeof value === 'string' && value.match(/^env\.\w+$/i)) {
      value = '<%= process.' + value + ' %>';
      obj[key] = template(value)(value);
    } else if (typeof value === 'string') {
      obj[key] = template(value)(value);
    }
  });

  return obj;
}

function parseSettings() {
  var val = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return interpolateValues.call(this, clone(val), this.templater.bind(this));
}