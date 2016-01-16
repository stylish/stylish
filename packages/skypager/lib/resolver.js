'use strict';

var _util = require('./util');

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

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
    Object.keys(options.modelPatterns).forEach(function (result, pattern) {
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
      }, _defineEnumerableProperties(_assign, _mutatorMap), _assign));
    }
  });

  return cache;
}

function testPatterns(value, items) {
  if (!value) {
    return false;
  }

  var matching = Object.keys(items).filter(function (key) {
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
//# sourceMappingURL=data:application/json;base64,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U0FBSyxHQUFHLEtBQUssSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQTs7QUFFOUMsUUFBSSxDQUFDLEtBQUssS0FBSyxNQUFNLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQ25GLFdBQUssR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUN2QztHQUNGOztBQUVELE1BQUksS0FBSyxFQUFFO0FBQ1QsV0FBTyxLQUFLLENBQUE7R0FDYjtDQUNGOzs7OztBQUFBLEFBS0QsU0FBUyxZQUFZLENBQUUsUUFBUSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDeEMsU0FBTyxRQUFRLENBQUE7Q0FDbkI7Ozs7O0FBQUEsQUFLRCxTQUFTLGFBQWEsQ0FBRSxRQUFRLEVBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUN6QyxTQUFPLFFBQVEsQ0FBQTtDQUNuQiIsImZpbGUiOiJyZXNvbHZlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNpbmd1bGFyaXplLCBrZXlzLCBhc3NpZ24gfSBmcm9tICcuL3V0aWwnXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlUmVzb2x2ZXIgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcblx0ICAgIGxldCBvcHRpb25zID0gcHJvamVjdC5vcHRpb25zLnJlc29sdmVyIHx8IHByb2plY3Qub3B0aW9ucyB8fCB7fVxuXG5cdCAgICBsZXQgYXNzZXQgXHQ9IChvcHRpb25zLmFzc2V0UmVzb2x2ZXIgfHwgYXNzZXRSZXNvbHZlcikuYmluZChwcm9qZWN0KVxuXHQgICAgbGV0IGxpbmsgXHRcdD0gKG9wdGlvbnMubGlua1Jlc29sdmVyIHx8IGxpbmtSZXNvbHZlcikuYmluZChwcm9qZWN0KVxuXHQgICAgbGV0IG1vZGVsIFx0PSAob3B0aW9ucy5tb2RlbFJlc29sdmVyIHx8IG1vZGVsUmVzb2x2ZXIpLmJpbmQocHJvamVjdClcblxuICBsZXQgcGF0dGVybnMgPSB7XG4gICAgbW9kZWxzOiBhZGRJbnRlcmZhY2Uoe30pLFxuICAgIGxpbmtzOiBhZGRJbnRlcmZhY2Uoe30pLFxuICAgIGFzc2V0czogYWRkSW50ZXJmYWNlKHt9KVxuICB9XG5cbiAgaWYgKG9wdGlvbnMubW9kZWxQYXR0ZXJucykge1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMubW9kZWxQYXR0ZXJucykuZm9yRWFjaCgocmVzdWx0LCBwYXR0ZXJuKSA9PiB7XG4gICAgICBpZiAocGF0dGVybiA9IG9wdGlvbnMubW9kZWxQYXR0ZXJuc1tyZXN1bHRdKSB7XG4gICAgICAgIHBhdHRlcm5zLm1vZGVscy5hZGQocGF0dGVybiwgcmVzdWx0KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4ge1xuICAgIGFzc2V0LFxuICAgIGxpbmssXG4gICAgbW9kZWwsXG4gICAgcGF0dGVybnMsXG4gICAgbW9kZWxzOiBtb2RlbFxuICB9XG59XG5cbmZ1bmN0aW9uIGFkZEludGVyZmFjZSAoY2FjaGUpIHtcbiAgYXNzaWduKGNhY2hlLCB7XG4gICAgaXRlbXM6IHt9LFxuXG4gICAgYWRkIChwYXR0ZXJuLCByZXN1bHQpIHtcbiAgICAgIGFzc2lnbihjYWNoZS5pdGVtcywge1xuICAgICAgICBnZXQgW3Jlc3VsdF0gKCkge1xuICAgICAgICAgIHJldHVybiBwYXR0ZXJuXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBjYWNoZVxufVxuXG5mdW5jdGlvbiB0ZXN0UGF0dGVybnMgKHZhbHVlLCBpdGVtcykge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBsZXQgbWF0Y2hpbmcgPSBPYmplY3Qua2V5cyhpdGVtcykuZmlsdGVyKGtleSA9PiB7XG4gICAgbGV0IHBhdHRlcm4gPSBpdGVtc1trZXldXG5cbiAgICBpZiAocGF0dGVybiAmJiBwYXR0ZXJuLnRlc3QgJiYgcGF0dGVybi50ZXN0KHZhbHVlLnRvU3RyaW5nKCkpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG5cbiAgICB9XG4gIH0pXG5cbiAgaWYgKG1hdGNoaW5nICYmIG1hdGNoaW5nWzBdKSB7XG4gICAgcmV0dXJuIG1hdGNoaW5nWzBdXG4gIH1cbn1cblxuZnVuY3Rpb24gbW9kZWxSZXNvbHZlciAoc3ViamVjdCwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgcmVnaXN0cnkgPSBwcm9qZWN0Lm1vZGVsc1xuICBsZXQgZ3Vlc3NlcyA9IFsgXVxuICBsZXQgcmVzdWx0XG5cbiAgaWYgKHR5cGVvZiAoc3ViamVjdCkgPT09ICdzdHJpbmcnKSB7XG4gICAgZ3Vlc3Nlcy5wdXNoKHN1YmplY3QpXG4gICAgZ3Vlc3Nlcy5wdXNoKHNpbmd1bGFyaXplKHN1YmplY3QpKVxuXG4gICAgaWYgKHN1YmplY3QubWF0Y2goL1xcLy8pKSB7XG4gICAgICBndWVzc2VzLnB1c2godGVzdFBhdHRlcm5zKHN1YmplY3QsIHByb2plY3QucmVzb2x2ZS5wYXR0ZXJucy5tb2RlbHMuaXRlbXMpKVxuICAgIH1cbiAgfVxuXG4gIC8vIGlmIHdlIGFyZSBnaXZlbiBhIGRvYyB3b3JrIHdpdGggdGhhdFxuICBpZiAodHlwZW9mIChzdWJqZWN0KSAhPT0gJ3N0cmluZycgJiYgc3ViamVjdC51cmkpIHtcbiAgICBpZiAoc3ViamVjdCAmJiBzdWJqZWN0LnR5cGUpIHsgZ3Vlc3Nlcy5wdXNoKHN1YmplY3QudHlwZSkgfVxuICAgIGlmIChzdWJqZWN0ICYmIHN1YmplY3QuZ3JvdXBOYW1lKSB7IGd1ZXNzZXMucHVzaChzdWJqZWN0Lmdyb3VwTmFtZSkgfVxuICAgIGd1ZXNzZXMucHVzaChzdWJqZWN0LnVyaSlcbiAgfVxuXG4gIGxldCBmb3VuZFxuXG4gIHdoaWxlICghZm91bmQgJiYgZ3Vlc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGd1ZXNzID0gZ3Vlc3Nlcy5zaGlmdCgpXG4gICAgZm91bmQgPSBndWVzcyAmJiByZWdpc3RyeS5sb29rdXAoZ3Vlc3MsIGZhbHNlKVxuXG4gICAgaWYgKCFmb3VuZCAmJiAocmVzdWx0ID0gdGVzdFBhdHRlcm5zKGd1ZXNzLCBwcm9qZWN0LnJlc29sdmUucGF0dGVybnMubW9kZWxzLml0ZW1zKSkpIHtcbiAgICAgIGZvdW5kID0gcmVnaXN0cnkubG9va3VwKHJlc3VsdCwgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgaWYgKGZvdW5kKSB7XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cbn1cblxuLyoqXG4qIGRldGVybWluZXMgdGhlIHZhbHVlcyB0byBiZSB1c2VkIGZvciBocmVmIGluIG1hcmtkb3duIGxpbmsgdGFncy4gZ2VuZXJhbGx5IGRlcGVuZHMgb24gaG9zdGluZyBlbnZpcm9ubWVudC5cbiovXG5mdW5jdGlvbiBsaW5rUmVzb2x2ZXIgKG9yaWdpbmFsLCBvcHRpb25zID0ge30pIHtcblx0ICAgIHJldHVybiBvcmlnaW5hbFxufVxuXG4vKipcbiogZGV0ZXJtaW5lcyB0aGUgdmFsdWUgdG8gYmUgdXNlZCBmb3IgYXNzZXQgdXJscy4gZ2VuZXJhbGx5IGRlcGVuZHMgb24gdGhlIGhvc3RpbmcgZW52aXJvbm1lbnRcbiovXG5mdW5jdGlvbiBhc3NldFJlc29sdmVyIChvcmlnaW5hbCwgb3B0aW9ucyA9IHt9KSB7XG5cdCAgICByZXR1cm4gb3JpZ2luYWxcbn1cbiJdfQ==