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

  return nodeList.filter(function (node) {
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
    });
  });
}

function abort(message) {
  console.log(message.red || message);
  process.exit(1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBMkNnQixLQUFLLEdBQUwsS0FBSztRQUlMLFFBQVEsR0FBUixRQUFRO1FBSVIsUUFBUSxHQUFSLFFBQVE7UUFJUixRQUFRLEdBQVIsUUFBUTtRQUlSLFFBQVEsR0FBUixRQUFRO1FBSVIsUUFBUSxHQUFSLFFBQVE7UUFJUixVQUFVLEdBQVYsVUFBVTtRQVVWLFlBQVksR0FBWixZQUFZO1FBU1osT0FBTyxHQUFQLE9BQU87UUFTUCxXQUFXLEdBQVgsV0FBVztRQUlYLFNBQVMsR0FBVCxTQUFTO1FBSVQsSUFBSSxHQUFKLElBQUk7UUF3QkosU0FBUyxHQUFULFNBQVM7UUFlVCxPQUFPLEdBQVAsT0FBTztRQUlQLFdBQVcsR0FBWCxXQUFXO1FBSVgsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQVdoQixNQUFNLEdBQU4sTUFBTTtRQUlOLEtBQUssR0FBTCxLQUFLO1FBU0wsTUFBTSxHQUFOLE1BQU07UUFNTixRQUFRLEdBQVIsUUFBUTtRQWdCUixVQUFVLEdBQVYsVUFBVTtRQXdDVixLQUFLLEdBQUwsS0FBSztRQUtMLHlCQUF5QixHQUF6Qix5QkFBeUI7UUFNekIsUUFBUSxHQUFSLFFBQVE7UUFFUix3QkFBd0IsR0FBeEIsd0JBQXdCO1FBa0N4QixPQUFPLEdBQVAsT0FBTztRQUlQLE9BQU8sR0FBUCxPQUFPO1FBUVAsV0FBVyxHQUFYLFdBQVc7UUF5QlgsS0FBSyxHQUFMLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMVRyQixJQUFNLFdBQVcsR0FBRyxnQkFBTSxPQUFPLENBQUE7QUFDakMsSUFBTSxLQUFLLEdBQUcscUJBQU8sVUFBVSxDQUFDLENBQUE7QUFDaEMsSUFBTSxZQUFZLEdBQUcsbUNBQW1DLENBQUE7O0FBRXhELE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSywyQkFBUSxDQUFBO0FBQzVCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSx5QkFBUyxDQUFBOztBQUU5QixJQUFJLE1BQU0sR0FBRztBQUNYLFFBQU0sRUFBRSxnQkFBVSxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBd0I7UUFBdEIsWUFBWSx5REFBRyxLQUFLOztBQUN0RCxVQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbEMsa0JBQVksRUFBRSxZQUFZO0FBQzFCLGdCQUFVLEVBQUUsS0FBSztBQUNqQixTQUFHLEVBQUUsZUFBWTtBQUNmLGVBQU8sQUFBQyxPQUFRLEVBQUUsQUFBQyxLQUFLLFVBQVUsR0FBSSxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQTtPQUMzRDtLQUNGLENBQUMsQ0FBQTtHQUNIOztBQUVELFVBQVEsRUFBRSxrQkFBVSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBd0I7UUFBdEIsWUFBWSx5REFBRyxLQUFLOztBQUMzRCxVQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDbEMsa0JBQVksRUFBRSxZQUFZO0FBQzFCLGdCQUFVLEVBQUUsS0FBSztBQUNqQixXQUFLLEVBQUUsS0FBSztLQUNiLENBQUMsQ0FBQTtHQUNIO0NBQ0YsQ0FBQTs7QUFHRCxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7QUFDOUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFBOztBQUU1QixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQzs7Ozs7O0FBQUEsQUFNbEQsU0FBUyxLQUFLLENBQUUsSUFBSSxFQUFFO0FBQzNCLFNBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Q0FDeEM7O0FBRU0sU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0NBQ3BEOztBQUVNLFNBQVMsUUFBUSxDQUFFLENBQUMsRUFBRTtBQUMzQixTQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDekM7O0FBRU0sU0FBUyxRQUFRLENBQUUsQ0FBQyxFQUFFO0FBQzNCLFNBQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtDQUMvQjs7QUFFTSxTQUFTLFFBQVEsQ0FBRSxDQUFDLEVBQUU7QUFDM0IsU0FBTyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQy9COztBQUVNLFNBQVMsUUFBUSxDQUFFLENBQUMsRUFBRTtBQUMzQixTQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUE7Q0FDL0I7O0FBRU0sU0FBUyxVQUFVLENBQUUsQ0FBQyxFQUFFO0FBQzdCLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDaEMsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztBQUFBLEFBQzlCLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7QUFBQSxBQUMvQixHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDdkIsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztBQUFBLEFBQzdCLEdBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFO0FBQUEsQUFDbkIsU0FBTyxDQUFDLENBQUE7Q0FDVDs7QUFFTSxTQUFTLFlBQVksQ0FBRSxDQUFDLEVBQUU7QUFDL0IsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNoQyxHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDO0FBQUEsQUFDOUIsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQztBQUFBLEFBQy9CLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUM7QUFBQSxBQUM3QixHQUFDLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUFBLEFBQ25CLFNBQU8sQ0FBQyxDQUFBO0NBQ1Q7O0FBRU0sU0FBUyxPQUFPLENBQUUsQ0FBQyxFQUFFO0FBQzFCLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDaEMsR0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQztBQUFBLEFBQzlCLEdBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7QUFBQSxBQUMvQixHQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDO0FBQUEsQUFDN0IsR0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUU7QUFBQSxBQUNuQixTQUFPLENBQUMsQ0FBQTtDQUNUOztBQUVNLFNBQVMsV0FBVyxDQUFFLElBQUksRUFBRTtBQUNqQyxTQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7Q0FDckM7O0FBRU0sU0FBUyxTQUFTLENBQUUsSUFBSSxFQUFFO0FBQy9CLFNBQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtDQUNuQzs7QUFFTSxTQUFTLElBQUksQ0FBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBcUI7TUFBbkIsVUFBVSx5REFBRyxJQUFJOztBQUM1RCxRQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUU7QUFDdkMsZ0JBQVksRUFBRSxJQUFJO0FBQ2xCLGNBQVUsRUFBRSxVQUFVO0FBQ3RCLE9BQUcsRUFBRSxlQUFZO0FBQ2YsYUFBUSxNQUFNLENBQUMsU0FBUyxDQUFDLEFBQUMsQ0FBQTs7QUFFMUIsVUFBSSxVQUFVLEVBQUU7QUFDZCxlQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO09BQzNDLE1BQU07O0FBQ0wsY0FBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTs7QUFFM0IsZ0JBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUN2QyxzQkFBVSxFQUFFLEtBQUs7QUFDakIsd0JBQVksRUFBRSxLQUFLO0FBQ25CLGVBQUcsRUFBRSxlQUFZO0FBQUUscUJBQU8sS0FBSyxDQUFBO2FBQUU7V0FDbEMsQ0FBQyxDQUFBOztBQUVGO2VBQU8sS0FBSztZQUFBOzs7O09BQ2I7S0FDRjtHQUNGLENBQUMsQ0FBQTtDQUNIOztBQUVNLFNBQVMsU0FBUyxDQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0FBQ2hELFFBQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRTtBQUN2QyxnQkFBWSxFQUFFLElBQUk7QUFDbEIsT0FBRyxFQUFFLGVBQVk7QUFDZixhQUFRLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxDQUFBOztBQUUxQixVQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLEFBQUMsV0FBSyxDQUFDLFlBQU07QUFBRSxjQUFNLEdBQUcsRUFBRSxFQUFFLENBQUE7T0FBRSxDQUFDLEVBQUcsQ0FBQTs7QUFFbEMsYUFBTyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsTUFBTSxDQUFBO0tBQ2xDO0dBQ0YsQ0FBQyxDQUFBO0NBQ0g7O0FBRU0sU0FBUyxPQUFPLENBQUUsS0FBSyxFQUFFO0FBQzlCLFNBQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1dBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7R0FBQSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0NBQy9DOztBQUVNLFNBQVMsV0FBVyxDQUFFLE1BQU0sRUFBRTtBQUNuQyxTQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUE7Q0FDdkM7O0FBRU0sU0FBUyxnQkFBZ0IsQ0FBRSxNQUFNLEVBQUUsTUFBTSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDNUQsTUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQTtBQUN6RCxNQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFBLEdBQUc7V0FBSSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUFBLENBQUMsQ0FBQTs7QUFFbkYsWUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7V0FBSSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7QUFDM0QsU0FBRyxFQUFFLGVBQVk7QUFDZixlQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtPQUNuQjtLQUNGLENBQUM7R0FBQSxDQUFDLENBQUE7Q0FDSjs7QUFFTSxTQUFTLE1BQU0sQ0FBRSxNQUFNLEVBQUU7QUFDOUIsU0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUc7V0FBSSxNQUFNLENBQUMsR0FBRyxDQUFDO0dBQUEsQ0FBQyxDQUFBO0NBQ25EOztBQUVNLFNBQVMsS0FBSyxDQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDckMsUUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsQUFBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQTs7QUFFcEQsUUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUksRUFBRTtBQUN6RCxRQUFJLElBQUksS0FBSyxhQUFhLEVBQUUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUM1RCxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUE7R0FDakQsQ0FBQyxDQUFBO0NBQ0g7O0FBRU0sU0FBUyxNQUFNLENBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUN0QyxTQUFPLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBSztBQUNqRCxXQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtHQUNyQixFQUFFLE1BQU0sQ0FBQyxDQUFBO0NBQ1g7O0FBRU0sU0FBUyxRQUFRLENBQUUsUUFBUSxFQUFFO0FBQ2xDLFNBQU87QUFDTCxRQUFJLGdCQUFFLE1BQU0sRUFBRTtBQUNaLGFBQU87QUFDTCxVQUFFLGNBQUUsTUFBTSxFQUFFO0FBQ1YsY0FBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQTs7QUFFNUQsY0FBSSxPQUFRLElBQUksQUFBQyxLQUFLLFdBQVcsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO0FBQ3RELGtCQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7V0FDOUM7U0FDRjtPQUNGLENBQUE7S0FDRjtHQUNGLENBQUE7Q0FDRjs7QUFFTSxTQUFTLFVBQVUsQ0FBRSxFQUFFLEVBQXdCO01BQXRCLFFBQVEseURBQUcsRUFBRTtNQUFFLEtBQUs7O0FBQ2xELElBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUE7QUFDdkIsVUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQTs7QUFFNUIsTUFBSSxJQUFJLEdBQUcsRUFBRyxDQUFBOztBQUVkLFNBQU8sWUFBWTtBQUNqQixVQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUMxQyxVQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDckMsWUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQTs7QUFFcEUsWUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLFlBQVksRUFBRTtBQUN6QyxnQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO1NBQ3BEO09BQ0Y7O0FBRUQsWUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQTtLQUNqRyxDQUFDLENBQUE7O0FBRUYsUUFBSSxNQUFNLFlBQUEsQ0FBQTs7QUFFVixRQUFJO0FBQ0YsWUFBTSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFBO0tBQ3ZDLENBQUMsT0FBTyxDQUFDLEVBQUU7QUFDVixZQUFNLEdBQUcsT0FBTyxDQUFBO0FBQ2hCLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RCLGFBQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDNUM7O0FBRUQsVUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNO2FBQUksT0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEFBQUM7S0FBQSxDQUFDLENBQUE7O0FBRWhFLFVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTyxFQUFJO0FBQ25DLGFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxBQUFDLENBQUE7QUFDeEIsWUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQTtLQUN2RixDQUFDLENBQUE7O0FBRUYsV0FBTyxNQUFNLENBQUE7R0FDZCxDQUFBO0NBQ0Y7O0FBRU0sU0FBUyxLQUFLLENBQUUsUUFBUSxFQUFFLFdBQVcsRUFBcUI7TUFBbkIsWUFBWSx5REFBRyxFQUFFOztBQUM3RCx1QkFBUSxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQTtBQUNoRCxTQUFPLFlBQVksQ0FBQTtDQUNwQjs7QUFFTSxTQUFTLHlCQUF5QixDQUFFLFNBQVMsRUFBRTtBQUNwRCxNQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDM0IsTUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLGNBQWMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0FBQ2pFLFNBQU8sUUFBUSxDQUFBO0NBQ2Y7O0FBRU0sU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFO0FBQUUsU0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO0NBQUU7O0FBRTdELFNBQVMsd0JBQXdCLENBQUUsU0FBUyxFQUFFO0FBQ25ELE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUE7QUFDckMsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBOztBQUUzQixNQUFJLFFBQVEsR0FBRyx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsQ0FBQTs7QUFFbkQsTUFBSSxRQUFRLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO0FBQ2hELFdBQU8sT0FBTyxDQUNiLElBQUksQ0FBQyxJQUFJLENBQ1IsU0FBUyxFQUNULFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQzNDLENBQ0QsQ0FBQTtHQUNEOztBQUVELE1BQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxDQUFDLEVBQUU7QUFDaEQsV0FBTyxPQUFPLENBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLENBQ25DLENBQUE7R0FDRDs7QUFFRCxNQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFFO0FBQzdDLFFBQUksQ0FBQyxHQUFHLE9BQU8sQ0FDYixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FDakMsQ0FBQTs7QUFFRCxRQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7QUFDN0IsV0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUE7S0FDOUQ7O0FBRUQsV0FBTyxDQUFDLENBQUE7R0FDUjtDQUNEOztBQUVNLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMzQixTQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxnQkFBZ0IsQ0FBQTtDQUNoRTs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDM0IsTUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLFdBQVcsR0FBRyxXQUFXLFVBQVUsR0FBRyx5Q0FBSCxHQUFHLEVBQUMsS0FBTSxRQUFRLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsS0FBSyxRQUFRLEVBQUU7QUFDL0gsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkOztBQUVNLFNBQVMsV0FBVyxHQUF5QjtNQUF2QixRQUFRLHlEQUFHLEVBQUU7TUFBRSxNQUFNOztBQUNoRCxNQUFLLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRztBQUNsQyxXQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDL0I7O0FBRUQsU0FBTyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQzdCLFdBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDdEMsVUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3ZCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFckIsVUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN2QyxlQUFPLElBQUksQ0FBQTtPQUNaOztBQUVELFVBQUksT0FBUSxLQUFLLEFBQUMsS0FBRyxRQUFRLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtBQUNoRCxlQUFPLElBQUksQ0FBQTtPQUNaOztBQUVELFVBQUksT0FBUSxLQUFLLEFBQUMsS0FBRyxRQUFRLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtBQUNoRCxlQUFPLElBQUksQ0FBQTtPQUNaO0tBQ0YsQ0FBQyxDQUFBO0dBQ0gsQ0FBQyxDQUFBO0NBQ0g7O0FBRU0sU0FBUyxLQUFLLENBQUMsT0FBTyxFQUFFO0FBQzVCLFNBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQTtBQUNuQyxTQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0NBQ2pCIiwiZmlsZSI6InV0aWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmlzaXQgZnJvbSAndW5pc3QtdXRpbC12aXNpdCdcbmltcG9ydCBhc3NpZ24gZnJvbSAnb2JqZWN0LWFzc2lnbidcbmltcG9ydCBkb3RwYXRoIGZyb20gJ29iamVjdC1wYXRoJ1xuaW1wb3J0IHV0aWxlIGZyb20gJ3V0aWxlJ1xuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgaW5mbGVjdGlvbnMgPSB1dGlsZS5pbmZsZWN0XG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXInKVxuY29uc3QgRE9NQUlOX1JFR0VYID0gL15bYS16QS1aMC05Xy1dK1xcLlsuYS16QS1aMC05Xy1dKyQvXG5cbm1vZHVsZS5leHBvcnRzLnZpc2l0ID0gdmlzaXRcbm1vZHVsZS5leHBvcnRzLmFzc2lnbiA9IGFzc2lnblxuXG5sZXQgaGlkZGVuID0ge1xuICBnZXR0ZXI6IGZ1bmN0aW9uICh0YXJnZXQsIG5hbWUsIGZuLCBjb25maWd1cmFibGUgPSBmYWxzZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgKGZuKSA9PT0gJ2Z1bmN0aW9uJykgPyBmbi5jYWxsKHRhcmdldCkgOiBmblxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgcHJvcGVydHk6IGZ1bmN0aW9uICh0YXJnZXQsIG5hbWUsIHZhbHVlLCBjb25maWd1cmFibGUgPSBmYWxzZSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWUsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogdmFsdWVcbiAgICB9KVxuICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMuaGlkZGVuID0gaGlkZGVuXG5tb2R1bGUuZXhwb3J0cy5oaWRlID0gaGlkZGVuXG5cbmhpZGRlbi5nZXR0ZXIobW9kdWxlLmV4cG9ydHMsICdpbmZsZWN0aW9ucycsIGluZmxlY3Rpb25zKVxuXG4vKipcbiogY2xvbmUgYW4gb2JqZWN0XG4qXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lIChiYXNlKSB7XG4gIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGJhc2UpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaHVtYW5pemUgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLmh1bWFuaXplKHMpLnJlcGxhY2UoLy18Xy9nLCAnICcpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0aXRsZWl6ZSAocykge1xuICByZXR1cm4gaW5mbGVjdGlvbnMudGl0bGVpemUoaHVtYW5pemUocykpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGFzc2lmeSAocykge1xuICByZXR1cm4gaW5mbGVjdGlvbnMuY2xhc3NpZnkocylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRhYmxlaXplIChzKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy50YWJsZWl6ZShzKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGFiZWxpemUgKHMpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLnRhYmxlaXplKHMpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmRlcnNjb3JlIChzKSB7XG4gIHMgPSBzLnJlcGxhY2UoL1xcXFx8XFwvL2csICctJywgJycpXG4gIHMgPSBzLnJlcGxhY2UoL1teLVxcd1xcc10vZywgJycpICAvLyByZW1vdmUgdW5uZWVkZWQgY2hhcnNcbiAgcyA9IHMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpIC8vIHRyaW0gbGVhZGluZy90cmFpbGluZyBzcGFjZXNcbiAgcyA9IHMucmVwbGFjZSgnLScsICdfJylcbiAgcyA9IHMucmVwbGFjZSgvWy1cXHNdKy9nLCAnXycpICAgLy8gY29udmVydCBzcGFjZXMgdG8gaHlwaGVuc1xuICBzID0gcy50b0xvd2VyQ2FzZSgpICAgICAgICAgICAgIC8vIGNvbnZlcnQgdG8gbG93ZXJjYXNlXG4gIHJldHVybiBzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJhbWV0ZXJpemUgKHMpIHtcbiAgcyA9IHMucmVwbGFjZSgvXFxcXHxcXC8vZywgJy0nLCAnJylcbiAgcyA9IHMucmVwbGFjZSgvW14tXFx3XFxzXS9nLCAnJykgIC8vIHJlbW92ZSB1bm5lZWRlZCBjaGFyc1xuICBzID0gcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykgLy8gdHJpbSBsZWFkaW5nL3RyYWlsaW5nIHNwYWNlc1xuICBzID0gcy5yZXBsYWNlKC9bLVxcc10rL2csICctJykgICAvLyBjb252ZXJ0IHNwYWNlcyB0byBoeXBoZW5zXG4gIHMgPSBzLnRvTG93ZXJDYXNlKCkgICAgICAgICAgICAgLy8gY29udmVydCB0byBsb3dlcmNhc2VcbiAgcmV0dXJuIHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNsdWdpZnkgKHMpIHtcbiAgcyA9IHMucmVwbGFjZSgvXFxcXHxcXC8vZywgJy0nLCAnJylcbiAgcyA9IHMucmVwbGFjZSgvW14tXFx3XFxzXS9nLCAnJykgIC8vIHJlbW92ZSB1bm5lZWRlZCBjaGFyc1xuICBzID0gcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJykgLy8gdHJpbSBsZWFkaW5nL3RyYWlsaW5nIHNwYWNlc1xuICBzID0gcy5yZXBsYWNlKC9bLVxcc10rL2csICctJykgICAvLyBjb252ZXJ0IHNwYWNlcyB0byBoeXBoZW5zXG4gIHMgPSBzLnRvTG93ZXJDYXNlKCkgICAgICAgICAgICAgLy8gY29udmVydCB0byBsb3dlcmNhc2VcbiAgcmV0dXJuIHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbmd1bGFyaXplICh3b3JkKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy5zaW5ndWxhcml6ZSh3b3JkKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcGx1cmFsaXplICh3b3JkKSB7XG4gIHJldHVybiBpbmZsZWN0aW9ucy5wbHVyYWxpemUod29yZClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhenkgKHRhcmdldCwgYXR0cmlidXRlLCBmbiwgZW51bWVyYWJsZSA9IHRydWUpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYXR0cmlidXRlLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGVudW1lcmFibGUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICBkZWxldGUgKHRhcmdldFthdHRyaWJ1dGVdKVxuXG4gICAgICBpZiAoZW51bWVyYWJsZSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W2F0dHJpYnV0ZV0gPSBmbi5jYWxsKHRhcmdldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCB2YWx1ZSA9IGZuLmNhbGwodGFyZ2V0KVxuXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGF0dHJpYnV0ZSwge1xuICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWx1ZSB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGF6eUFzeW5jICh0YXJnZXQsIGF0dHJpYnV0ZSwgZm4pIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgYXR0cmlidXRlLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVsZXRlICh0YXJnZXRbYXR0cmlidXRlXSlcblxuICAgICAgbGV0IHJlc3VsdFxuXG4gICAgICAoYXN5bmMoKCkgPT4geyByZXN1bHQgPSBmbigpIH0pKSgpXG5cbiAgICAgIHJldHVybiB0YXJnZXRbYXR0cmlidXRlXSA9IHJlc3VsdFxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4gKGFycmF5KSB7XG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKGEsIGIpID0+IGEuY29uY2F0KGIpLCBbXSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpbmd1bGFyaXplIChzdHJpbmcpIHtcbiAgcmV0dXJuIGluZmxlY3Rpb25zLnNpbmd1bGFyaXplKHN0cmluZylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURlbGVnYXRvcnMgKHRhcmdldCwgc291cmNlLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGV4Y2x1ZGVLZXlzID0gb3B0aW9ucy5leGNsdWRlIHx8IG9wdGlvbnMuZXhjZXB0IHx8IFtdXG4gIGxldCBzb3VyY2VLZXlzID0gT2JqZWN0LmtleXMoc291cmNlKS5maWx0ZXIoa2V5ID0+IGV4Y2x1ZGVLZXlzLmluZGV4T2Yoa2V5KSA9PT0gLTEpXG5cbiAgc291cmNlS2V5cy5mb3JFYWNoKGtleSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBzb3VyY2Vba2V5XVxuICAgIH1cbiAgfSkpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXMgKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoa2V5ID0+IG9iamVjdFtrZXldKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW4gKHRhcmdldCwgc291cmNlKSB7XG4gIHRhcmdldCA9IHRhcmdldC5wcm90b3R5cGU7IHNvdXJjZSA9IHNvdXJjZS5wcm90b3R5cGVcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhzb3VyY2UpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSAhPT0gJ2NvbnN0cnVjdG9yJykgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZSxcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBuYW1lKSlcbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFjY2VzcyAob2JqZWN0LCBkb3R0ZWQpIHtcbiAgcmV0dXJuIGRvdHRlZC5zcGxpdCgnLicpLnJlZHVjZSgobWVtbywgY3VycmVudCkgPT4ge1xuICAgIHJldHVybiBtZW1vW2N1cnJlbnRdXG4gIH0sIG9iamVjdClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlQcm9wIChwcm9wZXJ0eSkge1xuICByZXR1cm4ge1xuICAgIGZyb20gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdG8gKHRhcmdldCkge1xuICAgICAgICAgIGxldCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIHByb3BlcnR5KVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiAoZGVzYykgIT09ICd1bmRlZmluZWQnICYmIGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eSwgZGVzYylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vQ29uZmxpY3QgKGZuLCBwcm92aWRlciA9IHt9LCBzY29wZSkge1xuICBmbi5zaG91bGQuYmUuYS5GdW5jdGlvblxuICBwcm92aWRlci5zaG91bGQuYmUuYW4uT2JqZWN0XG5cbiAgbGV0IHNhZmUgPSB7IH1cblxuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIE9iamVjdC5rZXlzKHByb3ZpZGVyKS5mb3JFYWNoKGdsb2JhbFByb3AgPT4ge1xuICAgICAgaWYgKGdsb2JhbC5oYXNPd25Qcm9wZXJ0eShnbG9iYWxQcm9wKSkge1xuICAgICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2xvYmFsLCBnbG9iYWxQcm9wKVxuXG4gICAgICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHNhZmUsIGdsb2JhbFByb3AsIGRlc2NyaXB0b3IpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgZ2xvYmFsUHJvcCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm92aWRlciwgZ2xvYmFsUHJvcCkpXG4gICAgfSlcblxuICAgIGxldCByZXN1bHRcblxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSBzY29wZSA/IGZuLmNhbGwoc2NvcGUpIDogZm4oKVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJlc3VsdCA9ICdlcnJvcidcbiAgICAgIGNvbnNvbGUubG9nKGUubWVzc2FnZSlcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluIG5vIGNvbmZsaWN0IGZuJywgZSlcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhwcm92aWRlcikuZm9yRWFjaChyZW1vdmUgPT4gZGVsZXRlIChnbG9iYWxbcmVtb3ZlXSkpXG5cbiAgICBPYmplY3Qua2V5cyhzYWZlKS5mb3JFYWNoKHJlc3RvcmUgPT4ge1xuICAgICAgZGVsZXRlIChnbG9iYWxbcmVzdG9yZV0pXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ2xvYmFsLCByZXN0b3JlLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNhZmUsIHJlc3RvcmUpKVxuICAgIH0pXG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcnZlIChkYXRhUGF0aCwgcmVzdWx0VmFsdWUsIGluaXRpYWxWYWx1ZSA9IHt9KSB7XG4gIGRvdHBhdGguc2V0KGluaXRpYWxWYWx1ZSwgZGF0YVBhdGgsIHJlc3VsdFZhbHVlKVxuICByZXR1cm4gaW5pdGlhbFZhbHVlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkTWFuaWZlc3RGcm9tRGlyZWN0b3J5IChkaXJlY3RvcnkpIHtcbiAgdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcblx0dmFyIG1hbmlmZXN0ID0gcmVxdWlyZShwYXRoLmpvaW4oZGlyZWN0b3J5LCdwYWNrYWdlLmpzb24nKSkgfHwge31cblx0cmV0dXJuIG1hbmlmZXN0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RvbWFpbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUubWF0Y2goRE9NQUlOX1JFR0VYKSB9XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkUHJvamVjdEZyb21EaXJlY3RvcnkgKGRpcmVjdG9yeSkge1xuICB2YXIgZXhpc3RzID0gcmVxdWlyZSgnZnMnKS5leGlzdHNTeW5jXG4gIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cblx0dmFyIG1hbmlmZXN0ID0gbG9hZE1hbmlmZXN0RnJvbURpcmVjdG9yeShkaXJlY3RvcnkpXG5cblx0aWYgKG1hbmlmZXN0LnNreXBhZ2VyICYmIG1hbmlmZXN0LnNreXBhZ2VyLm1haW4pIHtcblx0XHRyZXR1cm4gcmVxdWlyZShcblx0XHRcdHBhdGguam9pbihcblx0XHRcdFx0ZGlyZWN0b3J5LFxuXHRcdFx0XHRtYW5pZmVzdC5za3lwYWdlci5tYWluLnJlcGxhY2UoL15cXC5cXC8vLCAnJylcblx0XHRcdClcblx0XHQpXG5cdH1cblxuXHRpZiAoZXhpc3RzKHBhdGguam9pbihkaXJlY3RvcnksICdza3lwYWdlci5qcycpKSkge1xuXHRcdHJldHVybiByZXF1aXJlKFxuXHRcdFx0cGF0aC5qb2luKGRpcmVjdG9yeSwgJ3NreXBhZ2VyLmpzJylcblx0XHQpXG5cdH1cblxuXHRpZiAoZXhpc3RzKHBhdGguam9pbihkaXJlY3RvcnksICdpbmRleC5qcycpKSkge1xuXHRcdHZhciBwID0gcmVxdWlyZShcblx0XHRcdCBwYXRoLmpvaW4oZGlyZWN0b3J5LCAnaW5kZXguanMnKVxuXHRcdClcblxuXHRcdGlmICghcC5yZWdpc3RyaWVzICYmICFwLmRvY3MpIHtcblx0XHRcdGFib3J0KCdUaGlzIHByb2plY3QgZG9lcyBub3Qgc2VlbSB0byBoYXZlIGEgc2t5cGFnZXIgcHJvamVjdCcpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBBcnJheV0nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZ2V4KHZhbCkge1xuICBpZiAoKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiB0eXBlb2YodmFsKSkgPT09ICdvYmplY3QnICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWwpLnRvU3RyaW5nKCkgPT09ICcvKD86KS8nKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXJRdWVyeSAobm9kZUxpc3QgPSBbXSwgcGFyYW1zKSB7XG4gIGlmICggdHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICByZXR1cm4gbm9kZUxpc3QuZmlsdGVyKHBhcmFtcylcbiAgfVxuXG4gIHJldHVybiBub2RlTGlzdC5maWx0ZXIobm9kZSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHBhcmFtcykuZXZlcnkoa2V5ID0+IHtcbiAgICAgIGxldCBwYXJhbSA9IHBhcmFtc1trZXldXG4gICAgICBsZXQgdmFsdWUgPSBub2RlW2tleV1cblxuICAgICAgaWYgKGlzUmVnZXgocGFyYW0pICYmIHBhcmFtLnRlc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgKHBhcmFtKT09PSdzdHJpbmcnICYmIHZhbHVlID09PSBwYXJhbSkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIChwYXJhbSk9PT0nbnVtYmVyJyAmJiB2YWx1ZSA9PT0gcGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9KVxuICB9KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYWJvcnQobWVzc2FnZSkge1xuICAgY29uc29sZS5sb2cobWVzc2FnZS5yZWQgfHwgbWVzc2FnZSlcbiAgIHByb2Nlc3MuZXhpdCgxKVxufVxuXG4iXX0=