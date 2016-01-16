'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DiskImporter = DiskImporter;
exports.AssetImporter = AssetImporter;
exports.ProjectImporter = ProjectImporter;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
* A non-blocking script which consolidates all interaction with the file system.
*
* The thinking behind separating this was inspired by the desire to have the skypager
* library also work in the browser, but have swappable backends for asset and data source
* content.
*/
function DiskImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project = this;

  if (options.asset && options.collection) {
    return AssetImporter.apply(project, arguments);
  }

  if (options.project) {
    return ProjectImporter.apply(project, arguments);
  }
}

/*
* This assumes an asset is in the collection already.

*/
function AssetImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];
  var asset = options.asset;

  if (options.sync) {
    asset.raw = require('fs').readFileSync(asset.paths.absolute).toString();
    callback && callback(this);
  } else {
    assetLoader(options, callback);
  }

  return asset;
}

function ProjectImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var path = require('path');
  var glob = require('glob');
  var project = this;
  var collections = options.collections || project.content;
  var autoLoad = options.autoLoad || {};

  Object.keys(collections).forEach(function (name) {
    var collection = collections[name];
    var pattern = collection.AssetClass.GLOB;
    var paths = glob.sync(pattern, {
      cwd: collection.root
    });

    collection._willLoadAssets(paths);

    paths.forEach(function (rel) {
      var uri = path.join(collection.root, rel);
      var asset = new collection.AssetClass(rel, { collection: collection, project: project });

      collection.add(asset, false, true);

      if (autoLoad[name]) {
        AssetImporter.call(project, { project: project, collection: collection, asset: asset });
      }
    });

    collection._didLoadAssets(paths, false);
  });

  callback && callback(project, options);

  return project;
}

exports.default = DiskImporter;

var assetLoader = (function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var callback = arguments[1];

    var _require, readFile, asset, collection, raw;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _require = require('fs-promise');
            readFile = _require.readFile;
            asset = options.asset;
            collection = options.collection;
            _context.prev = 4;
            _context.next = 7;
            return readFile(asset.paths.absolute).then(function (buffer) {
              return buffer.toString();
            });

          case 7:
            raw = _context.sent;

            asset.raw = raw;
            asset.assetWasImported();
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context['catch'](4);

            asset.error = _context.t0;
            throw _context.t0;

          case 16:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[4, 12]]);
  }));

  return function assetLoader(_x4, _x5) {
    return ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbXBvcnRlcnMvZGlzay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQU9nQixZQUFZLEdBQVosWUFBWTtRQWdCWixhQUFhLEdBQWIsYUFBYTtRQWFiLGVBQWUsR0FBZixlQUFlOzs7Ozs7Ozs7OztBQTdCeEIsU0FBUyxZQUFZLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUN4QyxNQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFFcEMsTUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7QUFDdkMsV0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQTtHQUMvQzs7QUFFRCxNQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsV0FBTyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQTtHQUNqRDtDQUNGOzs7Ozs7QUFBQSxBQU1NLFNBQVMsYUFBYSxHQUEwQjtNQUF4QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxRQUFRO01BQzdDLEtBQUssR0FBSyxPQUFPLENBQWpCLEtBQUs7O0FBRVgsTUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFNBQUssQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0FBQ3ZFLFlBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDM0IsTUFBTTtBQUNMLGVBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7R0FDL0I7O0FBRUQsU0FBTyxLQUFLLENBQUE7Q0FDYjs7QUFFTSxTQUFTLGVBQWUsR0FBMEI7TUFBeEIsT0FBTyx5REFBRyxFQUFFO01BQUUsUUFBUTs7QUFDckQsTUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzFCLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUMxQixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7QUFDbEIsTUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFBO0FBQ3hELE1BQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFBOztBQUVyQyxRQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUN2QyxRQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDbEMsUUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUE7QUFDeEMsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDN0IsU0FBRyxFQUFFLFVBQVUsQ0FBQyxJQUFJO0tBQ3JCLENBQUMsQ0FBQTs7QUFFRixjQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUVqQyxTQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ25CLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN6QyxVQUFJLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLEVBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQTs7QUFFdEYsZ0JBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQTs7QUFFbEMsVUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDbEIscUJBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFQLE9BQU8sRUFBRSxVQUFVLEVBQVYsVUFBVSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUMsQ0FBQyxDQUFBO09BQzFEO0tBQ0YsQ0FBQyxDQUFBOztBQUVGLGNBQVUsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFBO0dBQ3hDLENBQUMsQ0FBQTs7QUFFRixVQUFRLElBQUksUUFBUSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTs7QUFFdEMsU0FBTyxPQUFPLENBQUE7Q0FDZjs7a0JBRWMsWUFBWTs7O3NEQUUzQjtRQUE0QixPQUFPLHlEQUFHLEVBQUU7UUFBRSxRQUFROztrQkFDMUMsUUFBUSxFQUNSLEtBQUssRUFBRSxVQUFVLEVBR2pCLEdBQUc7Ozs7Ozt1QkFKVSxPQUFPLENBQUMsWUFBWSxDQUFDO0FBQWxDLG9CQUFRLFlBQVIsUUFBUTtBQUNSLGlCQUFLLEdBQWlCLE9BQU8sQ0FBN0IsS0FBSztBQUFFLHNCQUFVLEdBQUssT0FBTyxDQUF0QixVQUFVOzs7bUJBR0wsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBTTtxQkFBSyxNQUFNLENBQUMsUUFBUSxFQUFFO2FBQUEsQ0FBQzs7O0FBQTlFLGVBQUc7O0FBQ1AsaUJBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO0FBQ2YsaUJBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBOzs7Ozs7OztBQUV4QixpQkFBSyxDQUFDLEtBQUssY0FBUSxDQUFBOzs7Ozs7Ozs7R0FHdEI7O2tCQVpjLFdBQVciLCJmaWxlIjoiZGlzay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBBIG5vbi1ibG9ja2luZyBzY3JpcHQgd2hpY2ggY29uc29saWRhdGVzIGFsbCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBmaWxlIHN5c3RlbS5cbipcbiogVGhlIHRoaW5raW5nIGJlaGluZCBzZXBhcmF0aW5nIHRoaXMgd2FzIGluc3BpcmVkIGJ5IHRoZSBkZXNpcmUgdG8gaGF2ZSB0aGUgc2t5cGFnZXJcbiogbGlicmFyeSBhbHNvIHdvcmsgaW4gdGhlIGJyb3dzZXIsIGJ1dCBoYXZlIHN3YXBwYWJsZSBiYWNrZW5kcyBmb3IgYXNzZXQgYW5kIGRhdGEgc291cmNlXG4qIGNvbnRlbnQuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIERpc2tJbXBvcnRlciAob3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0ID0gdGhpc1xuXG4gIGlmIChvcHRpb25zLmFzc2V0ICYmIG9wdGlvbnMuY29sbGVjdGlvbikge1xuICAgIHJldHVybiBBc3NldEltcG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2plY3QpIHtcbiAgICByZXR1cm4gUHJvamVjdEltcG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxufVxuXG4vKlxuKiBUaGlzIGFzc3VtZXMgYW4gYXNzZXQgaXMgaW4gdGhlIGNvbGxlY3Rpb24gYWxyZWFkeS5cblxuKi9cbmV4cG9ydCBmdW5jdGlvbiBBc3NldEltcG9ydGVyIChvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gIGxldCB7IGFzc2V0IH0gPSBvcHRpb25zXG5cbiAgaWYgKG9wdGlvbnMuc3luYykge1xuICAgIGFzc2V0LnJhdyA9IHJlcXVpcmUoJ2ZzJykucmVhZEZpbGVTeW5jKGFzc2V0LnBhdGhzLmFic29sdXRlKS50b1N0cmluZygpXG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2sodGhpcylcbiAgfSBlbHNlIHtcbiAgICBhc3NldExvYWRlcihvcHRpb25zLCBjYWxsYmFjaylcbiAgfVxuXG4gIHJldHVybiBhc3NldFxufVxuXG5leHBvcnQgZnVuY3Rpb24gUHJvamVjdEltcG9ydGVyIChvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gIGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGxldCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpXG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBvcHRpb25zLmNvbGxlY3Rpb25zIHx8IHByb2plY3QuY29udGVudFxuICBsZXQgYXV0b0xvYWQgPSBvcHRpb25zLmF1dG9Mb2FkIHx8IHt9XG5cbiAgT2JqZWN0LmtleXMoY29sbGVjdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uc1tuYW1lXVxuICAgIGxldCBwYXR0ZXJuID0gY29sbGVjdGlvbi5Bc3NldENsYXNzLkdMT0JcbiAgICBsZXQgcGF0aHMgPSBnbG9iLnN5bmMocGF0dGVybiwge1xuICAgICAgY3dkOiBjb2xsZWN0aW9uLnJvb3RcbiAgICB9KVxuXG4gICAgY29sbGVjdGlvbi5fd2lsbExvYWRBc3NldHMocGF0aHMpXG5cbiAgICBwYXRocy5mb3JFYWNoKHJlbCA9PiB7XG4gICAgICBsZXQgdXJpID0gcGF0aC5qb2luKGNvbGxlY3Rpb24ucm9vdCwgcmVsKVxuICAgICAgbGV0IGFzc2V0ID0gbmV3IGNvbGxlY3Rpb24uQXNzZXRDbGFzcyhyZWwsIHtjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLCBwcm9qZWN0OiBwcm9qZWN0fSlcblxuICAgICAgY29sbGVjdGlvbi5hZGQoYXNzZXQsIGZhbHNlLCB0cnVlKVxuXG4gICAgICBpZiAoYXV0b0xvYWRbbmFtZV0pIHtcbiAgICAgICAgQXNzZXRJbXBvcnRlci5jYWxsKHByb2plY3QsIHtwcm9qZWN0LCBjb2xsZWN0aW9uLCBhc3NldH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNvbGxlY3Rpb24uX2RpZExvYWRBc3NldHMocGF0aHMsIGZhbHNlKVxuICB9KVxuXG4gIGNhbGxiYWNrICYmIGNhbGxiYWNrKHByb2plY3QsIG9wdGlvbnMpXG5cbiAgcmV0dXJuIHByb2plY3Rcbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlza0ltcG9ydGVyXG5cbmFzeW5jIGZ1bmN0aW9uIGFzc2V0TG9hZGVyIChvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gIGxldCB7IHJlYWRGaWxlIH0gPSByZXF1aXJlKCdmcy1wcm9taXNlJylcbiAgbGV0IHsgYXNzZXQsIGNvbGxlY3Rpb24gfSA9IG9wdGlvbnNcblxuICB0cnkge1xuICAgIGxldCByYXcgPSBhd2FpdCByZWFkRmlsZShhc3NldC5wYXRocy5hYnNvbHV0ZSkudGhlbigoYnVmZmVyKSA9PiBidWZmZXIudG9TdHJpbmcoKSlcbiAgICBhc3NldC5yYXcgPSByYXdcbiAgICBhc3NldC5hc3NldFdhc0ltcG9ydGVkKClcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBhc3NldC5lcnJvciA9IGVycm9yXG4gICAgdGhyb3cgKGVycm9yKVxuICB9XG59XG4iXX0=