'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Object = Object; /**
                       * The resolver is responsible for mapping short hand aliases and reference
                       * used throughout our assets, and especially documents, to the appropriate
                       * helpers or assets within the project.
                       *
                       * Documents are resolved to a modelClass first by analyzing the parent folder
                       * they belong to, then their YAML frontmatter by looking for a type property.
                       *
                       * In certain cases where neither of the above are convenient, regex patterns can
                       * be defined which will map a path to the appropriate model.
                       */

var keys = _Object.keys;
var assign = _Object.assign;

module.exports = function createResolver() {
  var project = this;
  var options = project.options.resolver || project.settings.resolver || project.options || {};

  (0, _util.defaults)(options, {
    modelPatterns: {}
  });

  // legacy
  if (project.get('settings.resolver.modelPatterns')) {
    options.modelPatterns = assign(options.modelPatterns, project.get('settings.resolver.modelPatterns'));
  }

  if (project.get('settings.resolver.models')) {
    options.modelPatterns = assign(options.modelPatterns, project.get('settings.resolver.models'));
  }

  var asset = (options.assetResolver || assetResolver).bind(project);
  var link = (options.linkResolver || linkResolver).bind(project);
  var model = (options.modelResolver || modelResolver).bind(project);

  var patterns = {
    models: addInterface({}),
    links: addInterface({}),
    assets: addInterface({})
  };

  keys(options.modelPatterns).forEach(function (result, pattern) {
    if (pattern = options.modelPatterns[result]) {
      patterns.models.add(pattern, result);
    }
  });

  return {
    asset: asset,
    link: link,
    model: model,
    patterns: patterns,
    models: model
  };
};

function addInterface(cache) {
  assign(cache, {
    items: {},

    add: function add(pattern, result) {
      var _assign, _mutatorMap;

      if (typeof pattern === 'string') {
        pattern = new RegExp(pattern);
      }

      assign(cache.items, (_assign = {}, _mutatorMap = {}, _mutatorMap[result] = _mutatorMap[result] || {}, _mutatorMap[result].get = function () {
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
    guesses.push(subject.dirname);
    guesses.push(subject.uri);
    guesses.push(subject.parentdir);
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