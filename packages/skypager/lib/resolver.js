'use strict';

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function createResolver() {
  var project = this;
  var options = project.options.resolver || project.options || {};

  var asset = (options.assetResolver || assetResolver).bind(project);
  var link = (options.linkResolver || linkResolver).bind(project);
  var model = (options.modelResolver || modelResolver).bind(project);

  var patterns = {
    models: addInterface({}),
    links: addInterface({}),
    assets: addInterface({})
  };

  if (options.modelPatterns) {
    (0, _keys2.default)(options.modelPatterns).forEach(function (result, pattern) {
      if (pattern = options.modelPatterns[result]) {
        patterns.models.add(pattern, result);
      }
    });
  }

  return {
    asset: asset,
    link: link,
    model: model,
    patterns: patterns,
    models: model
  };
};

function addInterface(cache) {
  (0, _util.assign)(cache, {
    items: {},

    add: function add(pattern, result) {
      var _assign, _mutatorMap;

      (0, _util.assign)(cache.items, (_assign = {}, _mutatorMap = {}, _mutatorMap[result] = _mutatorMap[result] || {}, _mutatorMap[result].get = function () {
        return pattern;
      }, (0, _defineEnumerableProperties3.default)(_assign, _mutatorMap), _assign));
    }
  });

  return cache;
}

function testPatterns(value, items) {
  if (!value) {
    return false;
  }

  var matching = (0, _keys2.default)(items).filter(function (key) {
    var pattern = items[key];

    if (pattern && pattern.test && pattern.test(value.toString())) {
      return true;
    } else {}
  });

  if (matching && matching[0]) {
    return matching[0];
  }
}

function modelResolver(subject) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var project = this;
  var registry = project.models;
  var guesses = [];
  var result = undefined;

  if (typeof subject === 'string') {
    guesses.push(subject);
    guesses.push((0, _util.singularize)(subject));

    if (subject.match(/\//)) {
      guesses.push(testPatterns(subject, project.resolve.patterns.models.items));
    }
  }

  // if we are given a doc work with that
  if (typeof subject !== 'string' && subject.uri) {
    if (subject && subject.type) {
      guesses.push(subject.type);
    }
    if (subject && subject.groupName) {
      guesses.push(subject.groupName);
    }
    guesses.push(subject.uri);
  }

  var found = undefined;

  while (!found && guesses.length > 0) {
    var guess = guesses.shift();
    found = guess && registry.lookup(guess, false);

    if (!found && (result = testPatterns(guess, project.resolve.patterns.models.items))) {
      found = registry.lookup(result, false);
    }
  }

  if (found) {
    return found;
  }
}

/**
* determines the values to be used for href in markdown link tags. generally depends on hosting environment.
*/
function linkResolver(original) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return original;
}

/**
* determines the value to be used for asset urls. generally depends on the hosting environment
*/
function assetResolver(original) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return original;
}