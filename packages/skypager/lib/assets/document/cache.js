'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DocumentParserCache = DocumentParserCache;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DocumentParserCache(document, method) {
  var buckets = {
    parse: document.asts.parsed,
    transform: document.asts.transformed,
    index: document.asets.indexed
  };

  var folder = document.project.paths.parser_cache;
  var cache_path = _path2.default.join(folder, document.cacheKey) + '.json';

  var data = undefined;

  try {
    data = require(_path2.default.resolve(cache_path));
    return data[method];
  } catch (e) {
    buckets[method] = document[method].call(document);

    var cachePayload = JSON.stringify(buckets);

    _fs2.default.writeFile(_path2.default.resolve(cache_path), cachePayload, function (err, result) {
      if (err) {
        throw err;
      }
    });

    return buckets[method];
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQvY2FjaGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFHZ0IsbUJBQW1CLEdBQW5CLG1CQUFtQjs7Ozs7Ozs7Ozs7O0FBQTVCLFNBQVMsbUJBQW1CLENBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRTtBQUNyRCxNQUFJLE9BQU8sR0FBRztBQUNaLFNBQUssRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU07QUFDM0IsYUFBUyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVztBQUNwQyxTQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPO0dBQzlCLENBQUE7O0FBRUQsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFBO0FBQ2hELE1BQUksVUFBVSxHQUFHLGVBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFBOztBQUUvRCxNQUFJLElBQUksWUFBQSxDQUFBOztBQUVSLE1BQUk7QUFDRixRQUFJLEdBQUcsT0FBTyxDQUFDLGVBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFDeEMsV0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7R0FDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNWLFdBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBOztBQUVqRCxRQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUUxQyxpQkFBRyxTQUFTLENBQUMsZUFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsWUFBWSxFQUFFLFVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBSztBQUNwRSxVQUFJLEdBQUcsRUFBRTtBQUFFLGNBQU8sR0FBRyxDQUFDO09BQUU7S0FDekIsQ0FBQyxDQUFBOztBQUVGLFdBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0dBQ3ZCO0NBQ0YiLCJmaWxlIjoiY2FjaGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuXG5leHBvcnQgZnVuY3Rpb24gRG9jdW1lbnRQYXJzZXJDYWNoZSAoZG9jdW1lbnQsIG1ldGhvZCkge1xuICBsZXQgYnVja2V0cyA9IHtcbiAgICBwYXJzZTogZG9jdW1lbnQuYXN0cy5wYXJzZWQsXG4gICAgdHJhbnNmb3JtOiBkb2N1bWVudC5hc3RzLnRyYW5zZm9ybWVkLFxuICAgIGluZGV4OiBkb2N1bWVudC5hc2V0cy5pbmRleGVkXG4gIH1cblxuICBsZXQgZm9sZGVyID0gZG9jdW1lbnQucHJvamVjdC5wYXRocy5wYXJzZXJfY2FjaGVcbiAgbGV0IGNhY2hlX3BhdGggPSBwYXRoLmpvaW4oZm9sZGVyLCBkb2N1bWVudC5jYWNoZUtleSkgKyAnLmpzb24nXG5cbiAgbGV0IGRhdGFcblxuICB0cnkge1xuICAgIGRhdGEgPSByZXF1aXJlKHBhdGgucmVzb2x2ZShjYWNoZV9wYXRoKSlcbiAgICByZXR1cm4gZGF0YVttZXRob2RdXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBidWNrZXRzW21ldGhvZF0gPSBkb2N1bWVudFttZXRob2RdLmNhbGwoZG9jdW1lbnQpXG5cbiAgICBsZXQgY2FjaGVQYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoYnVja2V0cylcblxuICAgIGZzLndyaXRlRmlsZShwYXRoLnJlc29sdmUoY2FjaGVfcGF0aCksIGNhY2hlUGF5bG9hZCwgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICBpZiAoZXJyKSB7IHRocm93IChlcnIpIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGJ1Y2tldHNbbWV0aG9kXVxuICB9XG59XG4iXX0=