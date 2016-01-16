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
  var enumerable = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  Object.defineProperty(target, attribute, {
    configurable: true,
    enumerable: enumerable,
    get: function get() {
      delete target[attribute];

      if (enumerable) {
        return target[attribute] = fn.call(target);
      } else {
        var _ret = (function () {
          var value = fn.call(target);

          Object.defineProperty(target, attribute, {
            enumerable: false,
            configurable: false,
            get: function get() {
              return value;
            }
          });

          return {
            v: value
          };
        })();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
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
      console.error('Error in no conflict fn', e);
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
//# sourceMappingURL=data:application/json;base64,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QUFRLEVBQUUsV0FBVyxFQUFxQjtNQUFuQixZQUFZLHlEQUFHLEVBQUU7O0FBQzdELHVCQUFRLEdBQUcsQ0FBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFBO0FBQ2hELFNBQU8sWUFBWSxDQUFBO0NBQ3BCIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmlzaXQgZnJvbSAndW5pc3QtdXRpbC12aXNpdCdcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcbmltcG9ydCBkb3RwYXRoIGZyb20gJ29iamVjdC1wYXRoJ1xuaW1wb3J0IHV0aWxlIGZyb20gJ3V0aWxlJ1xuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgaW5mbGVjdGlvbnMgPSB1dGlsZS5pbmZsZWN0XG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXInKVxuXG5tb2R1bGUuZXhwb3J0cy52aXNpdCA9IHZpc2l0XG5tb2R1bGUuZXhwb3J0cy5hc3NpZ24gPSBhc3NpZ25cblxubGV0IGhpZGRlbiA9IHtcbiAgZ2V0dGVyOiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCBmbiwgY29uZmlndXJhYmxlID0gZmFsc2UpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mIChmbikgPT09ICdmdW5jdGlvbicpID8gZm4uY2FsbCh0YXJnZXQpIDogZm5cbiAgICAgIH1cbiAgICB9KVxuICB9LFxuXG4gIHByb3BlcnR5OiBmdW5jdGlvbiAodGFyZ2V0LCBuYW1lLCB2YWx1ZSwgY29uZmlndXJhYmxlID0gZmFsc2UpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBuYW1lLCB7XG4gICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IHZhbHVlXG4gICAgfSlcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzLmhpZGRlbiA9IGhpZGRlblxubW9kdWxlLmV4cG9ydHMuaGlkZSA9IGhpZGRlblxuXG5oaWRkZW4uZ2V0dGVyKG1vZHVsZS5leHBvcnRzLCAnaW5mbGVjdGlvbnMnLCBpbmZsZWN0aW9ucylcblxuLyoqXG4qIGNsb25lIGFuIG9iamVjdFxuKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZSAoYmFzZSkge1xuICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShiYXNlKSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGh1bWFuaXplIChzKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy5odW1hbml6ZShzKS5yZXBsYWNlKC8tfF8vZywgJyAnKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGl0bGVpemUgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLnRpdGxlaXplKGh1bWFuaXplKHMpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xhc3NpZnkgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLmNsYXNzaWZ5KHMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0YWJsZWl6ZSAocykge1xuICByZXR1cm4gaW5mbGVjdGlvbnMudGFibGVpemUocylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRhYmVsaXplIChzKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy50YWJsZWl6ZShzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdW5kZXJzY29yZSAocykge1xuICBzID0gcy5yZXBsYWNlKC9cXFxcfFxcLy9nLCAnLScsICcnKVxuICBzID0gcy5yZXBsYWNlKC9bXi1cXHdcXHNdL2csICcnKSAgLy8gcmVtb3ZlIHVubmVlZGVkIGNoYXJzXG4gIHMgPSBzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKSAvLyB0cmltIGxlYWRpbmcvdHJhaWxpbmcgc3BhY2VzXG4gIHMgPSBzLnJlcGxhY2UoJy0nLCAnXycpXG4gIHMgPSBzLnJlcGxhY2UoL1stXFxzXSsvZywgJ18nKSAgIC8vIGNvbnZlcnQgc3BhY2VzIHRvIGh5cGhlbnNcbiAgcyA9IHMudG9Mb3dlckNhc2UoKSAgICAgICAgICAgICAvLyBjb252ZXJ0IHRvIGxvd2VyY2FzZVxuICByZXR1cm4gc1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyYW1ldGVyaXplIChzKSB7XG4gIHMgPSBzLnJlcGxhY2UoL1xcXFx8XFwvL2csICctJywgJycpXG4gIHMgPSBzLnJlcGxhY2UoL1teLVxcd1xcc10vZywgJycpICAvLyByZW1vdmUgdW5uZWVkZWQgY2hhcnNcbiAgcyA9IHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIC8vIHRyaW0gbGVhZGluZy90cmFpbGluZyBzcGFjZXNcbiAgcyA9IHMucmVwbGFjZSgvWy1cXHNdKy9nLCAnLScpICAgLy8gY29udmVydCBzcGFjZXMgdG8gaHlwaGVuc1xuICBzID0gcy50b0xvd2VyQ2FzZSgpICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gIHJldHVybiBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzbHVnaWZ5IChzKSB7XG4gIHMgPSBzLnJlcGxhY2UoL1xcXFx8XFwvL2csICctJywgJycpXG4gIHMgPSBzLnJlcGxhY2UoL1teLVxcd1xcc10vZywgJycpICAvLyByZW1vdmUgdW5uZWVkZWQgY2hhcnNcbiAgcyA9IHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIC8vIHRyaW0gbGVhZGluZy90cmFpbGluZyBzcGFjZXNcbiAgcyA9IHMucmVwbGFjZSgvWy1cXHNdKy9nLCAnLScpICAgLy8gY29udmVydCBzcGFjZXMgdG8gaHlwaGVuc1xuICBzID0gcy50b0xvd2VyQ2FzZSgpICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gIHJldHVybiBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW5ndWxhcml6ZSAod29yZCkge1xuICByZXR1cm4gaW5mbGVjdGlvbnMuc2luZ3VsYXJpemUod29yZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBsdXJhbGl6ZSAod29yZCkge1xuICByZXR1cm4gaW5mbGVjdGlvbnMucGx1cmFsaXplKHdvcmQpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXp5ICh0YXJnZXQsIGF0dHJpYnV0ZSwgZm4sIGVudW1lcmFibGUgPSB0cnVlKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGF0dHJpYnV0ZSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVsZXRlICh0YXJnZXRbYXR0cmlidXRlXSlcblxuICAgICAgaWYgKGVudW1lcmFibGUpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFthdHRyaWJ1dGVdID0gZm4uY2FsbCh0YXJnZXQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgdmFsdWUgPSBmbi5jYWxsKHRhcmdldClcblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBhdHRyaWJ1dGUsIHtcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWUgfVxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhenlBc3luYyAodGFyZ2V0LCBhdHRyaWJ1dGUsIGZuKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGF0dHJpYnV0ZSwge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGRlbGV0ZSAodGFyZ2V0W2F0dHJpYnV0ZV0pXG5cbiAgICAgIGxldCByZXN1bHRcblxuICAgICAgKGFzeW5jKCgpID0+IHsgcmVzdWx0ID0gZm4oKSB9KSkoKVxuXG4gICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZV0gPSByZXN1bHRcbiAgICB9XG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuIChhcnJheSkge1xuICByZXR1cm4gYXJyYXkucmVkdWNlKChhLCBiKSA9PiBhLmNvbmNhdChiKSwgW10pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaW5ndWxhcml6ZSAoc3RyaW5nKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy5zaW5ndWxhcml6ZShzdHJpbmcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVEZWxlZ2F0b3JzICh0YXJnZXQsIHNvdXJjZSwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBleGNsdWRlS2V5cyA9IG9wdGlvbnMuZXhjbHVkZSB8fCBvcHRpb25zLmV4Y2VwdCB8fCBbXVxuICBsZXQgc291cmNlS2V5cyA9IE9iamVjdC5rZXlzKHNvdXJjZSkuZmlsdGVyKGtleSA9PiBleGNsdWRlS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKVxuXG4gIHNvdXJjZUtleXMuZm9yRWFjaChrZXkgPT4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gc291cmNlW2tleV1cbiAgICB9XG4gIH0pKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdmFsdWVzIChvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCkubWFwKGtleSA9PiBvYmplY3Rba2V5XSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1peGluICh0YXJnZXQsIHNvdXJjZSkge1xuICB0YXJnZXQgPSB0YXJnZXQucHJvdG90eXBlOyBzb3VyY2UgPSBzb3VyY2UucHJvdG90eXBlXG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoc291cmNlKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKG5hbWUgIT09ICdjb25zdHJ1Y3RvcicpIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwgbmFtZSkpXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhY2Nlc3MgKG9iamVjdCwgZG90dGVkKSB7XG4gIHJldHVybiBkb3R0ZWQuc3BsaXQoJy4nKS5yZWR1Y2UoKG1lbW8sIGN1cnJlbnQpID0+IHtcbiAgICByZXR1cm4gbWVtb1tjdXJyZW50XVxuICB9LCBvYmplY3QpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5UHJvcCAocHJvcGVydHkpIHtcbiAgcmV0dXJuIHtcbiAgICBmcm9tIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRvICh0YXJnZXQpIHtcbiAgICAgICAgICBsZXQgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBwcm9wZXJ0eSlcblxuICAgICAgICAgIGlmICh0eXBlb2YgKGRlc2MpICE9PSAndW5kZWZpbmVkJyAmJiBkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHksIGRlc2MpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub0NvbmZsaWN0IChmbiwgcHJvdmlkZXIgPSB7fSwgc2NvcGUpIHtcbiAgZm4uc2hvdWxkLmJlLmEuRnVuY3Rpb25cbiAgcHJvdmlkZXIuc2hvdWxkLmJlLmFuLk9iamVjdFxuXG4gIGxldCBzYWZlID0geyB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBPYmplY3Qua2V5cyhwcm92aWRlcikuZm9yRWFjaChnbG9iYWxQcm9wID0+IHtcbiAgICAgIGlmIChnbG9iYWwuaGFzT3duUHJvcGVydHkoZ2xvYmFsUHJvcCkpIHtcbiAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGdsb2JhbCwgZ2xvYmFsUHJvcClcblxuICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzYWZlLCBnbG9iYWxQcm9wLCBkZXNjcmlwdG9yKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIGdsb2JhbFByb3AsIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdmlkZXIsIGdsb2JhbFByb3ApKVxuICAgIH0pXG5cbiAgICBsZXQgcmVzdWx0XG5cbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gc2NvcGUgPyBmbi5jYWxsKHNjb3BlKSA6IGZuKClcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXN1bHQgPSAnZXJyb3InXG4gICAgICBjb25zb2xlLmxvZyhlLm1lc3NhZ2UpXG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbiBubyBjb25mbGljdCBmbicsIGUpXG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMocHJvdmlkZXIpLmZvckVhY2gocmVtb3ZlID0+IGRlbGV0ZSAoZ2xvYmFsW3JlbW92ZV0pKVxuXG4gICAgT2JqZWN0LmtleXMoc2FmZSkuZm9yRWFjaChyZXN0b3JlID0+IHtcbiAgICAgIGRlbGV0ZSAoZ2xvYmFsW3Jlc3RvcmVdKVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgcmVzdG9yZSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzYWZlLCByZXN0b3JlKSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXJ2ZSAoZGF0YVBhdGgsIHJlc3VsdFZhbHVlLCBpbml0aWFsVmFsdWUgPSB7fSkge1xuICBkb3RwYXRoLnNldChpbml0aWFsVmFsdWUsIGRhdGFQYXRoLCByZXN1bHRWYWx1ZSlcbiAgcmV0dXJuIGluaXRpYWxWYWx1ZVxufVxuIl19