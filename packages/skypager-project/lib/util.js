'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dotpath = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

exports.humanize = humanize;
exports.titleize = titleize;
exports.classify = classify;
exports.tableize = tableize;
exports.tabelize = tabelize;
exports.underscore = underscore;
exports.parameterize = parameterize;
exports.slugify = slugify;
exports.singularize = singularize;
exports.pluralize = pluralize;
exports.lazy = lazy;
exports.lazyAsync = lazyAsync;
exports.flatten = flatten;
exports.singularize = singularize;
exports.createDelegators = createDelegators;
exports.values = values;
exports.mixin = mixin;
exports.access = access;
exports.copyProp = copyProp;
exports.noConflict = noConflict;
exports.carve = carve;
exports.isDomain = isDomain;
exports.isPromise = isPromise;
exports.isArray = isArray;
exports.isRegex = isRegex;
exports.filterQuery = filterQuery;
exports.abort = abort;
exports.findPackageSync = findPackageSync;
exports.findPackage = findPackage;
exports.splitPath = splitPath;
exports.skypagerBabel = skypagerBabel;
exports.pathExists = pathExists;
exports.loadProjectFromDirectory = loadProjectFromDirectory;
exports.loadManifestFromDirectory = loadManifestFromDirectory;

var _path = require('path');

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utile = require('utile');

var _utile2 = _interopRequireDefault(_utile);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inflections = _utile2.default.inflect;
var DOMAIN_REGEX = /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/;

var dotpath = exports.dotpath = {
  set: _lodash.set, get: _lodash.get
};

module.exports.visit = _unistUtilVisit2.default;
module.exports.assign = _objectAssign2.default;
module.exports.defaults = _lodash.defaults;
module.exports.pick = _lodash.pick;
module.exports.any = _lodash.any;
module.exports.result = _lodash.result;
module.exports.clone = _lodash.cloneDeep;
module.exports.template = _lodash.template;

var hidden = {
  getter: function getter(target, name, fn) {
    var configurable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    (0, _defineProperty2.default)(target, name, {
      configurable: configurable,
      enumerable: false,
      get: function get() {
        return typeof fn === 'function' ? fn.call(target) : fn;
      }
    });
  },

  property: function property(target, name, value) {
    var configurable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    (0, _defineProperty2.default)(target, name, {
      configurable: configurable,
      enumerable: false,
      value: value
    });
  }
};

module.exports.hidden = hidden;
module.exports.hide = hidden;

hidden.getter(module.exports, 'inflections', inflections);

function humanize(s) {
  return inflections.humanize(s).replace(/-|_/g, ' ');
}

function titleize(s) {
  return inflections.titleize(humanize(s));
}

function classify(s) {
  return inflections.classify(s);
}

function tableize(s) {
  return inflections.tableize(s);
}

function tabelize(s) {
  return inflections.tableize(s);
}

function underscore(s) {
  s = s.replace(/\\|\//g, '-', '');
  s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  s = s.replace('-', '_');
  s = s.replace(/[-\s]+/g, '_'); // convert spaces to hyphens
  s = s.toLowerCase(); // convert to lowercase
  return s;
}

function parameterize(s) {
  s = s.replace(/\\|\//g, '-', '');
  s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-'); // convert spaces to hyphens
  s = s.toLowerCase(); // convert to lowercase
  return s;
}

function slugify(s) {
  return parameterize(s);
}

function singularize(word) {
  return inflections.singularize(word);
}

function pluralize(word) {
  return inflections.pluralize(word);
}

function lazy(target, attribute, fn) {
  var enumerable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  (0, _defineProperty2.default)(target, attribute, {
    configurable: true,
    enumerable: enumerable,
    get: function get() {
      delete target[attribute];

      if (enumerable) {
        return target[attribute] = fn.call(target);
      } else {
        var value = fn.call(target);

        (0, _defineProperty2.default)(target, attribute, {
          enumerable: false,
          configurable: true,
          value: value
        });

        return value;
      }
    }
  });
}

function lazyAsync(target, attribute, fn) {
  (0, _defineProperty2.default)(target, attribute, {
    configurable: true,
    get: function get() {
      delete target[attribute];

      var result = undefined;

      async(function () {
        result = fn();
      })();

      return target[attribute] = result;
    }
  });
}

function flatten(array) {
  return array.reduce(function (a, b) {
    return a.concat(b);
  }, []);
}

function singularize(string) {
  return inflections.singularize(string);
}

function createDelegators(target, source) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var excludeKeys = options.exclude || options.except || [];
  var sourceKeys = (0, _keys2.default)(source).filter(function (key) {
    return excludeKeys.indexOf(key) === -1;
  });

  sourceKeys.forEach(function (key) {
    return (0, _defineProperty2.default)(target, key, {
      get: function get() {
        return source[key];
      }
    });
  });
}

function values(object) {
  return (0, _keys2.default)(object).map(function (key) {
    return object[key];
  });
}

function mixin(target, source) {
  target = target.prototype;source = source.prototype;

  (0, _getOwnPropertyNames2.default)(source).forEach(function (name) {
    if (name !== 'constructor') (0, _defineProperty2.default)(target, name, (0, _getOwnPropertyDescriptor2.default)(source, name));
  });
}

function access(object, dotted) {
  return dotted.split('.').reduce(function (memo, current) {
    return memo[current];
  }, object);
}

function copyProp(property) {
  return {
    from: function from(source) {
      return {
        to: function to(target) {
          var desc = (0, _getOwnPropertyDescriptor2.default)(source, property);

          if (typeof desc !== 'undefined' && desc.configurable) {
            (0, _defineProperty2.default)(target, property, desc);
          }
        }
      };
    }
  };
}

function noConflict(fn) {
  var provider = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var scope = arguments[2];

  invariant(fn, 'provide a function');
  invariant(provider, 'provide a provider');

  var safe = {};

  return function () {
    (0, _keys2.default)(provider).forEach(function (globalProp) {
      if (global.hasOwnProperty(globalProp)) {
        var descriptor = (0, _getOwnPropertyDescriptor2.default)(global, globalProp);

        if (descriptor && descriptor.configurable) {
          (0, _defineProperty2.default)(safe, globalProp, descriptor);
        }
      }

      (0, _defineProperty2.default)(global, globalProp, (0, _getOwnPropertyDescriptor2.default)(provider, globalProp));
    });

    var result = undefined;

    try {
      result = scope ? fn.call(scope) : fn();
    } catch (e) {
      result = 'error';
      console.log(e.message);
      console.error('Error in no conflict fn', e.message, e.stack);
    }

    (0, _keys2.default)(provider).forEach(function (remove) {
      return delete global[remove];
    });

    (0, _keys2.default)(safe).forEach(function (restore) {
      delete global[restore];
      (0, _defineProperty2.default)(global, restore, (0, _getOwnPropertyDescriptor2.default)(safe, restore));
    });

    return result;
  };
}

function carve(dataPath, resultValue) {
  var initialValue = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  dotpath.set(initialValue, dataPath, resultValue);
  return initialValue;
}

function isDomain(value) {
  return value.match(DOMAIN_REGEX);
}

function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof val === 'undefined' ? 'undefined' : (0, _typeof3.default)(val)) === 'object' && (0, _getPrototypeOf2.default)(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
}

function filterQuery() {
  var nodeList = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var params = arguments[1];

  if (typeof params === 'function') {
    return nodeList.filter(params);
  }

  return (nodeList || []).filter(function (node) {
    return (0, _keys2.default)(params).every(function (key) {
      var param = params[key];
      var value = node[key];

      if (isRegex(param) && param.test(value)) {
        return true;
      }

      if (typeof param === 'string' && value === param) {
        return true;
      }

      if (typeof param === 'number' && value === param) {
        return true;
      }

      // treat normal arrays to search for any exact matches
      if (isArray(param)) {
        return param.any(function (val) {
          return val === value;
        });
      }
    });
  });
}

function abort(message) {
  console.log(message.red || message);
  process.exit(1);
}

function findPackageSync(packageName) {
  var root = arguments.length <= 1 || arguments[1] === undefined ? process.env.PWD : arguments[1];

  var findModules = require('find-node-modules');
  var path = require('path');

  var moduleDirectories = findModules(root, { relative: false });

  var directory = moduleDirectories.find(function (p) {
    var exists = pathExists((0, _path.join)(p, packageName));
    return exists;
  });

  if (!directory) {
    try {
      var resolvedPath = path.dirname(require.resolve(packageName));
      return resolvedPath;
    } catch (error) {
      console.log('Error looking up package', packageName, error.message);
    }
  }

  return directory && path.resolve(path.join(directory, packageName));
}

function findPackage(packageName) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new _promise2.default(function (resolve, reject) {
    var moduleDirectories = findModules(process.env.PWD, { relative: false });
    var directory = moduleDirectories.find(function (p) {
      var exists = pathExists((0, _path.join)(p, packageName));
      return exists;
    });

    if (!directory) {
      try {
        var resolvedPath = path.dirname(require.resolve(packageName));
        resolve(resolvedPath);
        return;
      } catch (error) {}
    }

    if (!directory) {
      reject(packageName);
    }

    var result = path.resolve(path.join(directory, packageName));

    if (result) {
      resolve(result);
    }
  });
}

function splitPath() {
  var p = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return path.resolve(p).split(path.sep);
}

function skypagerBabel() {
  var presets = findPackageSync('babel-preset-skypager');

  try {
    presets ? require('babel-register')({ presets: presets }) : require('babel-register');
  } catch (error) {
    abort('Error loading the babel-register library. Do you have the babel-preset-skypager package?');
  }
}

function pathExists(fp) {
  var fs = require('fs');
  var fn = typeof fs.access === 'function' ? fs.accessSync : fs.statSync;

  try {
    fn(fp);
    return true;
  } catch (error) {
    return false;
  }
}

function loadProjectFromDirectory(directory, skypagerProject) {
  var exists = pathExists;
  var path = require('path');

  global.$skypager = global.$skypager || {};

  try {
    skypagerProject = skypagerProject || $skypager && $skypager['skypager-project'] && require($skypager['skypager-project']);
    skypagerProject = skypagerProject || require('skypager-project');
  } catch (error) {
    console.log('There was an error attempting to load the ' + 'skypager-project'.magenta + ' package.');
    console.log('Usually this means it is not installed or can not be found relative to the current directory');
    console.log();
    console.log('The exact error message we received is: '.yellow);
    console.log(error.message);
    console.log('stack trace: '.yellow);
    console.log(error.stack);
    process.exit(1);
    return;
  }

  var manifest = loadManifestFromDirectory(directory);

  if (!manifest) {
    throw 'Could not load project from ' + directory;
  }

  if (manifest.skypager && manifest.skypager.main) {
    return require(path.join(directory, manifest.skypager.main.replace(/^\.\//, '')));
  }

  if (manifest.skypager) {
    return skypagerProject.load((0, _path.join)(directory, 'package.json'));
  }

  if (exists(path.join(directory, 'skypager.js'))) {
    return require(path.join(directory, 'skypager.js'));
  }
}

function loadManifestFromDirectory(directory) {
  return require('findup-sync')('package.json', { cwd: directory });
}