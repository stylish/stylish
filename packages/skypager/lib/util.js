'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;
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
exports.loadManifestFromDirectory = loadManifestFromDirectory;
exports.isDomain = isDomain;
exports.loadProjectFromDirectory = loadProjectFromDirectory;
exports.isPromise = isPromise;
exports.isArray = isArray;
exports.isRegex = isRegex;
exports.filterQuery = filterQuery;
exports.abort = abort;

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _utile = require('utile');

var _utile2 = _interopRequireDefault(_utile);

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var inflections = _utile2.default.inflect;
var debug = (0, _debug3.default)('skypager');
var DOMAIN_REGEX = /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/;

module.exports.visit = _unistUtilVisit2.default;
module.exports.assign = _objectAssign2.default;

var hidden = {
  getter: function getter(target, name, fn) {
    var configurable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    Object.defineProperty(target, name, {
      configurable: configurable,
      enumerable: false,
      get: function get() {
        return typeof fn === 'function' ? fn.call(target) : fn;
      }
    });
  },

  property: function property(target, name, value) {
    var configurable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    Object.defineProperty(target, name, {
      configurable: configurable,
      enumerable: false,
      value: value
    });
  }
};

module.exports.hidden = hidden;
module.exports.hide = hidden;

hidden.getter(module.exports, 'inflections', inflections);

/**
* clone an object
*
*/
function clone(base) {
  return JSON.parse(JSON.stringify(base));
}

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
  s = s.replace(/\\|\//g, '-', '');
  s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-'); // convert spaces to hyphens
  s = s.toLowerCase(); // convert to lowercase
  return s;
}

function singularize(word) {
  return inflections.singularize(word);
}

function pluralize(word) {
  return inflections.pluralize(word);
}

function lazy(target, attribute, fn) {
  var enumerable = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

  Object.defineProperty(target, attribute, {
    configurable: true,
    enumerable: enumerable,
    get: function get() {
      delete target[attribute];

      if (enumerable) {
        return target[attribute] = fn.call(target);
      } else {
        var value = fn.call(target);

        Object.defineProperty(target, attribute, {
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
  Object.defineProperty(target, attribute, {
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
  var sourceKeys = Object.keys(source).filter(function (key) {
    return excludeKeys.indexOf(key) === -1;
  });

  sourceKeys.forEach(function (key) {
    return Object.defineProperty(target, key, {
      get: function get() {
        return source[key];
      }
    });
  });
}

function values(object) {
  return Object.keys(object).map(function (key) {
    return object[key];
  });
}

function mixin(target, source) {
  target = target.prototype;source = source.prototype;

  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (name !== 'constructor') Object.defineProperty(target, name, Object.getOwnPropertyDescriptor(source, name));
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
          var desc = Object.getOwnPropertyDescriptor(source, property);

          if (typeof desc !== 'undefined' && desc.configurable) {
            Object.defineProperty(target, property, desc);
          }
        }
      };
    }
  };
}

function noConflict(fn) {
  var provider = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var scope = arguments[2];

  fn.should.be.a.Function;
  provider.should.be.an.Object;

  var safe = {};

  return function () {
    Object.keys(provider).forEach(function (globalProp) {
      if (global.hasOwnProperty(globalProp)) {
        var descriptor = Object.getOwnPropertyDescriptor(global, globalProp);

        if (descriptor && descriptor.configurable) {
          Object.defineProperty(safe, globalProp, descriptor);
        }
      }

      Object.defineProperty(global, globalProp, Object.getOwnPropertyDescriptor(provider, globalProp));
    });

    var result = undefined;

    try {
      result = scope ? fn.call(scope) : fn();
    } catch (e) {
      result = 'error';
      console.log(e.message);
      console.error('Error in no conflict fn', e.message, e.stack);
    }

    Object.keys(provider).forEach(function (remove) {
      return delete global[remove];
    });

    Object.keys(safe).forEach(function (restore) {
      delete global[restore];
      Object.defineProperty(global, restore, Object.getOwnPropertyDescriptor(safe, restore));
    });

    return result;
  };
}

function carve(dataPath, resultValue) {
  var initialValue = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  _objectPath2.default.set(initialValue, dataPath, resultValue);
  return initialValue;
}

function loadManifestFromDirectory(directory) {
  var path = require('path');
  var manifest = require(path.join(directory, 'package.json')) || {};
  return manifest;
}

function isDomain(value) {
  return value.match(DOMAIN_REGEX);
}

function loadProjectFromDirectory(directory) {
  var exists = require('fs').existsSync;
  var path = require('path');

  var manifest = loadManifestFromDirectory(directory);

  if (manifest.skypager && manifest.skypager.main) {
    return require(path.join(directory, manifest.skypager.main.replace(/^\.\//, '')));
  }

  if (exists(path.join(directory, 'skypager.js'))) {
    return require(path.join(directory, 'skypager.js'));
  }

  if (exists(path.join(directory, 'index.js'))) {
    var p = require(path.join(directory, 'index.js'));

    if (!p.registries && !p.docs) {
      abort('This project does not seem to have a skypager project');
    }

    return p;
  }
}

function isPromise(obj) {
  return !!obj && ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
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
    return Object.keys(params).every(function (key) {
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
//# sourceMappingURL=data:application/json;base64,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QUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7Q0FDcEQ7O0FBRU0sU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUN6Qzs7QUFFTSxTQUFTLFFBQVEsQ0FBRSxDQUFDLEVBQUU7QUFDM0IsU0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQy9COztBQUVNLFNBQVMsUUFBUSxDQUFFLENBQUMsRUFBRTtBQUMzQixTQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDL0I7O0FBRU0sU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUMvQjs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxDQUFDLEVBQUU7QUFDN0IsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNoQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0FBQUEsQUFDOUIsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztBQUFBLEFBQy9CLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO0FBQUEsQUFDN0IsR0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFBQSxBQUNuQixTQUFPLENBQUMsQ0FBQTtDQUNUOztBQUVNLFNBQVMsWUFBWSxDQUFFLENBQUMsRUFBRTtBQUMvQixHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFF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QTtPQUN2QztLQUNGLENBQUMsQ0FBQTtHQUNILENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUM1QixTQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUE7QUFDbkMsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUNqQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHZpc2l0IGZyb20gJ3VuaXN0LXV0aWwtdmlzaXQnXG5pbXBvcnQgYXNzaWduIGZyb20gJ29iamVjdC1hc3NpZ24nXG5pbXBvcnQgZG90cGF0aCBmcm9tICdvYmplY3QtcGF0aCdcbmltcG9ydCB1dGlsZSBmcm9tICd1dGlsZSdcbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmNvbnN0IGluZmxlY3Rpb25zID0gdXRpbGUuaW5mbGVjdFxuY29uc3QgZGVidWcgPSBfZGVidWcoJ3NreXBhZ2VyJylcbmNvbnN0IERPTUFJTl9SRUdFWCA9IC9eW2EtekEtWjAtOV8tXStcXC5bLmEtekEtWjAtOV8tXSskL1xuXG5tb2R1bGUuZXhwb3J0cy52aXNpdCA9IHZpc2l0XG5tb2R1bGUuZXhwb3J0cy5hc3NpZ24gPSBhc3NpZ25cblxubGV0IGhpZGRlbiA9IHtcbiAgZ2V0dGVyOiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCBmbiwgY29uZmlndXJhYmxlID0gZmFsc2UpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpID8gZm4uY2FsbCh0YXJnZXQpIDogZm5cbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIHByb3BlcnR5OiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCB2YWx1ZSwgY29uZmlndXJhYmxlID0gZmFsc2UpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSlcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzLmhpZGRlbiA9IGhpZGRlblxubW9kdWxlLmV4cG9ydHMuaGlkZSA9IGhpZGRlblxuXG5oaWRkZW4uZ2V0dGVyKG1vZHVsZS5leHBvcnRzLCAnaW5mbGVjdGlvbnMnLCBpbmZsZWN0aW9ucylcblxuLyoqXG4qIGNsb25lIGFuIG9iamVjdFxuKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZSAoYmFzZSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShiYXNlKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuaXplIChzKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy5odW1hbml6ZShzKS5yZXBsYWNlKC8tfF8vZywgJyAnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGVpemUgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLnRpdGxlaXplKGh1bWFuaXplKHMpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnkgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLmNsYXNzaWZ5KHMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0YWJsZWl6ZSAocykge1xuICByZXR1cm4gaW5mbGVjdGlvbnMudGFibGVpemUocylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRhYmVsaXplIChzKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy50YWJsZWl6ZShzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5kZXJzY29yZSAocykge1xuICBzID0gcy5yZXBsYWNlKC9cXFxcfFxcLy9nLCAnLScsICcnKVxuICBzID0gcy5yZXBsYWNlKC9bXi1cXHdcXHNdL2csICcnKSAgLy8gcmVtb3ZlIHVubmVlZGVkIGNoYXJzXG4gIHMgPSBzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSAvLyB0cmltIGxlYWRpbmcvdHJhaWxpbmcgc3BhY2VzXG4gIHMgPSBzLnJlcGxhY2UoJy0nLCAnXycpXG4gIHMgPSBzLnJlcGxhY2UoL1stXFxzXSsvZywgJ18nKSAgIC8vIGNvbnZlcnQgc3BhY2VzIHRvIGh5cGhlbnNcbiAgcyA9IHMudG9Mb3dlckNhc2UoKSAgICAgICAgICAgICAvLyBjb252ZXJ0IHRvIGxvd2VyY2FzZVxuICByZXR1cm4gc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYW1ldGVyaXplIChzKSB7XG4gIHMgPSBzLnJlcGxhY2UoL1xcXFx8XFwvL2csICctJywgJycpXG4gIHMgPSBzLnJlcGxhY2UoL1teLVxcd1xcc10vZywgJycpICAvLyByZW1vdmUgdW5uZWVkZWQgY2hhcnNcbiAgcyA9IHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIC8vIHRyaW0gbGVhZGluZy90cmFpbGluZyBzcGFjZXNcbiAgcyA9IHMucmVwbGFjZSgvWy1cXHNdKy9nLCAnLScpICAgLy8gY29udmVydCBzcGFjZXMgdG8gaHlwaGVuc1xuICBzID0gcy50b0xvd2VyQ2FzZSgpICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gIHJldHVybiBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5IChzKSB7XG4gIHMgPSBzLnJlcGxhY2UoL1xcXFx8XFwvL2csICctJywgJycpXG4gIHMgPSBzLnJlcGxhY2UoL1teLVxcd1xcc10vZywgJycpICAvLyByZW1vdmUgdW5uZWVkZWQgY2hhcnNcbiAgcyA9IHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIC8vIHRyaW0gbGVhZGluZy90cmFpbGluZyBzcGFjZXNcbiAgcyA9IHMucmVwbGFjZSgvWy1cXHNdKy9nLCAnLScpICAgLy8gY29udmVydCBzcGFjZXMgdG8gaHlwaGVuc1xuICBzID0gcy50b0xvd2VyQ2FzZSgpICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gIHJldHVybiBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW5ndWxhcml6ZSAod29yZCkge1xuICByZXR1cm4gaW5mbGVjdGlvbnMuc2luZ3VsYXJpemUod29yZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsdXJhbGl6ZSAod29yZCkge1xuICByZXR1cm4gaW5mbGVjdGlvbnMucGx1cmFsaXplKHdvcmQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5ICh0YXJnZXQsIGF0dHJpYnV0ZSwgZm4sIGVudW1lcmFibGUgPSBmYWxzZSkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBhdHRyaWJ1dGUsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZW51bWVyYWJsZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRlbGV0ZSAodGFyZ2V0W2F0dHJpYnV0ZV0pXG5cbiAgICAgIGlmIChlbnVtZXJhYmxlKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlXSA9IGZuLmNhbGwodGFyZ2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHZhbHVlID0gZm4uY2FsbCh0YXJnZXQpXG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYXR0cmlidXRlLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIHZhbHVlXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF6eUFzeW5jICh0YXJnZXQsIGF0dHJpYnV0ZSwgZm4pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYXR0cmlidXRlLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVsZXRlICh0YXJnZXRbYXR0cmlidXRlXSlcblxuICAgICAgbGV0IHJlc3VsdFxuXG4gICAgICAoYXN5bmMoKCkgPT4geyByZXN1bHQgPSBmbigpIH0pKSgpXG5cbiAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlXSA9IHJlc3VsdFxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4gKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbmd1bGFyaXplIChzdHJpbmcpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLnNpbmd1bGFyaXplKHN0cmluZylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlbGVnYXRvcnMgKHRhcmdldCwgc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGV4Y2x1ZGVLZXlzID0gb3B0aW9ucy5leGNsdWRlIHx8IG9wdGlvbnMuZXhjZXB0IHx8IFtdXG4gIGxldCBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKS5maWx0ZXIoa2V5ID0+IGV4Y2x1ZGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG5cbiAgc291cmNlS2V5cy5mb3JFYWNoKGtleSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzb3VyY2Vba2V5XVxuICAgIH1cbiAgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMgKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW4gKHRhcmdldCwgc291cmNlKSB7XG4gIHRhcmdldCA9IHRhcmdldC5wcm90b3R5cGU7IHNvdXJjZSA9IHNvdXJjZS5wcm90b3R5cGVcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gJ2NvbnN0cnVjdG9yJykgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSxcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjY2VzcyAob2JqZWN0LCBkb3R0ZWQpIHtcbiAgcmV0dXJuIGRvdHRlZC5zcGxpdCgnLicpLnJlZHVjZSgobWVtbywgY3VycmVudCkgPT4ge1xuICAgIHJldHVybiBtZW1vW2N1cnJlbnRdXG4gIH0sIG9iamVjdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlQcm9wIChwcm9wZXJ0eSkge1xuICByZXR1cm4ge1xuICAgIGZyb20gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG8gKHRhcmdldCkge1xuICAgICAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BlcnR5KVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiAoZGVzYykgIT09ICd1bmRlZmluZWQnICYmIGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgZGVzYylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vQ29uZmxpY3QgKGZuLCBwcm92aWRlciA9IHt9LCBzY29wZSkge1xuICBmbi5zaG91bGQuYmUuYS5GdW5jdGlvblxuICBwcm92aWRlci5zaG91bGQuYmUuYW4uT2JqZWN0XG5cbiAgbGV0IHNhZmUgPSB7IH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHByb3ZpZGVyKS5mb3JFYWNoKGdsb2JhbFByb3AgPT4ge1xuICAgICAgaWYgKGdsb2JhbC5oYXNPd25Qcm9wZXJ0eShnbG9iYWxQcm9wKSkge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2xvYmFsLCBnbG9iYWxQcm9wKVxuXG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNhZmUsIGdsb2JhbFByb3AsIGRlc2NyaXB0b3IpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgZ2xvYmFsUHJvcCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm92aWRlciwgZ2xvYmFsUHJvcCkpXG4gICAgfSlcblxuICAgIGxldCByZXN1bHRcblxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBzY29wZSA/IGZuLmNhbGwoc2NvcGUpIDogZm4oKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdlcnJvcidcbiAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSlcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIG5vIGNvbmZsaWN0IGZuJywgZS5tZXNzYWdlLCBlLnN0YWNrKVxuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHByb3ZpZGVyKS5mb3JFYWNoKHJlbW92ZSA9PiBkZWxldGUgKGdsb2JhbFtyZW1vdmVdKSlcblxuICAgIE9iamVjdC5rZXlzKHNhZmUpLmZvckVhY2gocmVzdG9yZSA9PiB7XG4gICAgICBkZWxldGUgKGdsb2JhbFtyZXN0b3JlXSlcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIHJlc3RvcmUsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc2FmZSwgcmVzdG9yZSkpXG4gICAgfSlcblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FydmUgKGRhdGFQYXRoLCByZXN1bHRWYWx1ZSwgaW5pdGlhbFZhbHVlID0ge30pIHtcbiAgZG90cGF0aC5zZXQoaW5pdGlhbFZhbHVlLCBkYXRhUGF0aCwgcmVzdWx0VmFsdWUpXG4gIHJldHVybiBpbml0aWFsVmFsdWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRNYW5pZmVzdEZyb21EaXJlY3RvcnkgKGRpcmVjdG9yeSkge1xuICB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXHR2YXIgbWFuaWZlc3QgPSByZXF1aXJlKHBhdGguam9pbihkaXJlY3RvcnksJ3BhY2thZ2UuanNvbicpKSB8fCB7fVxuXHRyZXR1cm4gbWFuaWZlc3Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRG9tYWluKHZhbHVlKSB7IHJldHVybiB2YWx1ZS5tYXRjaChET01BSU5fUkVHRVgpIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeSAoZGlyZWN0b3J5KSB7XG4gIHZhciBleGlzdHMgPSByZXF1aXJlKCdmcycpLmV4aXN0c1N5bmNcbiAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXHR2YXIgbWFuaWZlc3QgPSBsb2FkTWFuaWZlc3RGcm9tRGlyZWN0b3J5KGRpcmVjdG9yeSlcblxuXHRpZiAobWFuaWZlc3Quc2t5cGFnZXIgJiYgbWFuaWZlc3Quc2t5cGFnZXIubWFpbikge1xuXHRcdHJldHVybiByZXF1aXJlKFxuXHRcdFx0cGF0aC5qb2luKFxuXHRcdFx0XHRkaXJlY3RvcnksXG5cdFx0XHRcdG1hbmlmZXN0LnNreXBhZ2VyLm1haW4ucmVwbGFjZSgvXlxcLlxcLy8sICcnKVxuXHRcdFx0KVxuXHRcdClcblx0fVxuXG5cdGlmIChleGlzdHMocGF0aC5qb2luKGRpcmVjdG9yeSwgJ3NreXBhZ2VyLmpzJykpKSB7XG5cdFx0cmV0dXJuIHJlcXVpcmUoXG5cdFx0XHRwYXRoLmpvaW4oZGlyZWN0b3J5LCAnc2t5cGFnZXIuanMnKVxuXHRcdClcblx0fVxuXG5cdGlmIChleGlzdHMocGF0aC5qb2luKGRpcmVjdG9yeSwgJ2luZGV4LmpzJykpKSB7XG5cdFx0dmFyIHAgPSByZXF1aXJlKFxuXHRcdFx0IHBhdGguam9pbihkaXJlY3RvcnksICdpbmRleC5qcycpXG5cdFx0KVxuXG5cdFx0aWYgKCFwLnJlZ2lzdHJpZXMgJiYgIXAuZG9jcykge1xuXHRcdFx0YWJvcnQoJ1RoaXMgcHJvamVjdCBkb2VzIG5vdCBzZWVtIHRvIGhhdmUgYSBza3lwYWdlciBwcm9qZWN0Jylcblx0XHR9XG5cblx0XHRyZXR1cm4gcFxuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2UgKG9iaikge1xuICByZXR1cm4gISFvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJnKSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWdleCh2YWwpIHtcbiAgaWYgKCh0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogdHlwZW9mKHZhbCkpID09PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsKS50b1N0cmluZygpID09PSAnLyg/OikvJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyUXVlcnkgKG5vZGVMaXN0ID0gW10sIHBhcmFtcykge1xuICBpZiAoIHR5cGVvZiBwYXJhbXMgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgcmV0dXJuIG5vZGVMaXN0LmZpbHRlcihwYXJhbXMpXG4gIH1cblxuICByZXR1cm4gKG5vZGVMaXN0IHx8IFtdKS5maWx0ZXIobm9kZSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmFtcykuZXZlcnkoa2V5ID0+IHtcbiAgICAgIGxldCBwYXJhbSA9IHBhcmFtc1trZXldXG4gICAgICBsZXQgdmFsdWUgPSBub2RlW2tleV1cblxuICAgICAgaWYgKGlzUmVnZXgocGFyYW0pICYmIHBhcmFtLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgKHBhcmFtKT09PSdzdHJpbmcnICYmIHZhbHVlID09PSBwYXJhbSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIChwYXJhbSk9PT0nbnVtYmVyJyAmJiB2YWx1ZSA9PT0gcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gdHJlYXQgbm9ybWFsIGFycmF5cyB0byBzZWFyY2ggZm9yIGFueSBleGFjdCBtYXRjaGVzXG4gICAgICBpZiAoaXNBcnJheShwYXJhbSkpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtLmFueSh2YWwgPT4gdmFsID09PSB2YWx1ZSlcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWJvcnQobWVzc2FnZSkge1xuICAgY29uc29sZS5sb2cobWVzc2FnZS5yZWQgfHwgbWVzc2FnZSlcbiAgIHByb2Nlc3MuZXhpdCgxKVxufVxuXG4iXX0=