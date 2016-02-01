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
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var project = options.project = options.project || this;

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
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var asset = options.asset;

  var callback = options.onComplete;

  if (typeof context === 'function') {
    callback = context;
  }

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
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

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

  var callback = options.onComplete;

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

  return function assetLoader(_x7, _x8) {
    return ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbXBvcnRlcnMvZGlzay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQU9nQixZQUFZLEdBQVosWUFBWTtRQWdCWixhQUFhLEdBQWIsYUFBYTtRQW1CYixlQUFlLEdBQWYsZUFBZTs7Ozs7Ozs7Ozs7QUFuQ3hCLFNBQVMsWUFBWSxHQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RELE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUE7O0FBRXZELE1BQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZDLFdBQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDL0M7O0FBRUQsTUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLFdBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDakQ7Q0FDRjs7Ozs7O0FBQUEsQUFNTSxTQUFTLGFBQWEsR0FBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFO01BQ2pELEtBQUssR0FBSyxPQUFPLENBQWpCLEtBQUs7O0FBRVgsTUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQTs7QUFFakMsTUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDakMsWUFBUSxHQUFHLE9BQU8sQ0FBQTtHQUNuQjs7QUFFRCxNQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsU0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUE7QUFDdkUsWUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMs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Qjs7a0JBWmMsV0FBVyIsImZpbGUiOiJkaXNrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIEEgbm9uLWJsb2NraW5nIHNjcmlwdCB3aGljaCBjb25zb2xpZGF0ZXMgYWxsIGludGVyYWN0aW9uIHdpdGggdGhlIGZpbGUgc3lzdGVtLlxuKlxuKiBUaGUgdGhpbmtpbmcgYmVoaW5kIHNlcGFyYXRpbmcgdGhpcyB3YXMgaW5zcGlyZWQgYnkgdGhlIGRlc2lyZSB0byBoYXZlIHRoZSBza3lwYWdlclxuKiBsaWJyYXJ5IGFsc28gd29yayBpbiB0aGUgYnJvd3NlciwgYnV0IGhhdmUgc3dhcHBhYmxlIGJhY2tlbmRzIGZvciBhc3NldCBhbmQgZGF0YSBzb3VyY2VcbiogY29udGVudC5cbiovXG5leHBvcnQgZnVuY3Rpb24gRGlza0ltcG9ydGVyIChvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzXG5cbiAgaWYgKG9wdGlvbnMuYXNzZXQgJiYgb3B0aW9ucy5jb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIEFzc2V0SW1wb3J0ZXIuYXBwbHkocHJvamVjdCwgYXJndW1lbnRzKVxuICB9XG5cbiAgaWYgKG9wdGlvbnMucHJvamVjdCkge1xuICAgIHJldHVybiBQcm9qZWN0SW1wb3J0ZXIuYXBwbHkocHJvamVjdCwgYXJndW1lbnRzKVxuICB9XG59XG5cbi8qXG4qIFRoaXMgYXNzdW1lcyBhbiBhc3NldCBpcyBpbiB0aGUgY29sbGVjdGlvbiBhbHJlYWR5LlxuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIEFzc2V0SW1wb3J0ZXIgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxldCB7IGFzc2V0IH0gPSBvcHRpb25zXG5cbiAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5vbkNvbXBsZXRlXG5cbiAgaWYgKHR5cGVvZiBjb250ZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgY2FsbGJhY2sgPSBjb250ZXh0XG4gIH1cblxuICBpZiAob3B0aW9ucy5zeW5jKSB7XG4gICAgYXNzZXQucmF3ID0gcmVxdWlyZSgnZnMnKS5yZWFkRmlsZVN5bmMoYXNzZXQucGF0aHMuYWJzb2x1dGUpLnRvU3RyaW5nKClcbiAgICBjYWxsYmFjayAmJiBjYWxsYmFjayh0aGlzKVxuICB9IGVsc2Uge1xuICAgIGFzc2V0TG9hZGVyKG9wdGlvbnMsIGNhbGxiYWNrKVxuICB9XG5cbiAgcmV0dXJuIGFzc2V0XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0SW1wb3J0ZXIgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIGxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4gIGxldCBnbG9iID0gcmVxdWlyZSgnZ2xvYicpXG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBvcHRpb25zLmNvbGxlY3Rpb25zIHx8IHByb2plY3QuY29udGVudFxuICBsZXQgYXV0b0xvYWQgPSBvcHRpb25zLmF1dG9Mb2FkIHx8IHt9XG5cbiAgT2JqZWN0LmtleXMoY29sbGVjdGlvbnMpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgbGV0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9uc1tuYW1lXVxuICAgIGxldCBwYXR0ZXJuID0gY29sbGVjdGlvbi5Bc3NldENsYXNzLkdMT0JcblxuICAgIGxldCBwYXRocyA9IGdsb2Iuc3luYyhwYXR0ZXJuLCB7XG4gICAgICBjd2Q6IGNvbGxlY3Rpb24ucm9vdFxuICAgIH0pXG5cbiAgICBjb2xsZWN0aW9uLl93aWxsTG9hZEFzc2V0cyhwYXRocylcblxuICAgIHBhdGhzLmZvckVhY2gocmVsID0+IHtcbiAgICAgIGxldCB1cmkgPSBwYXRoLmpvaW4oY29sbGVjdGlvbi5yb290LCByZWwpXG4gICAgICBsZXQgYXNzZXQgPSBuZXcgY29sbGVjdGlvbi5Bc3NldENsYXNzKHJlbCwge2NvbGxlY3Rpb246IGNvbGxlY3Rpb24sIHByb2plY3Q6IHByb2plY3R9KVxuXG4gICAgICBjb2xsZWN0aW9uLmFkZChhc3NldCwgZmFsc2UsIHRydWUpXG5cbiAgICAgIGlmIChhdXRvTG9hZFtuYW1lXSkge1xuICAgICAgICBBc3NldEltcG9ydGVyLmNhbGwocHJvamVjdCwge3Byb2plY3QsIGNvbGxlY3Rpb24sIGFzc2V0fSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY29sbGVjdGlvbi5fZGlkTG9hZEFzc2V0cyhwYXRocywgZmFsc2UpXG4gIH0pXG5cbiAgbGV0IGNhbGxiYWNrID0gb3B0aW9ucy5vbkNvbXBsZXRlXG5cbiAgY2FsbGJhY2sgJiYgY2FsbGJhY2socHJvamVjdCwgb3B0aW9ucylcblxuICByZXR1cm4gcHJvamVjdFxufVxuXG5leHBvcnQgZGVmYXVsdCBEaXNrSW1wb3J0ZXJcblxuYXN5bmMgZnVuY3Rpb24gYXNzZXRMb2FkZXIgKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIHtcbiAgbGV0IHsgcmVhZEZpbGUgfSA9IHJlcXVpcmUoJ2ZzLXByb21pc2UnKVxuICBsZXQgeyBhc3NldCwgY29sbGVjdGlvbiB9ID0gb3B0aW9uc1xuXG4gIHRyeSB7XG4gICAgbGV0IHJhdyA9IGF3YWl0IHJlYWRGaWxlKGFzc2V0LnBhdGhzLmFic29sdXRlKS50aGVuKChidWZmZXIpID0+IGJ1ZmZlci50b1N0cmluZygpKVxuICAgIGFzc2V0LnJhdyA9IHJhd1xuICAgIGFzc2V0LmFzc2V0V2FzSW1wb3J0ZWQoKVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGFzc2V0LmVycm9yID0gZXJyb3JcbiAgICB0aHJvdyAoZXJyb3IpXG4gIH1cbn1cbiJdfQ==