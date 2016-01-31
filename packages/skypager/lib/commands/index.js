'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = undefined;
exports.configure = configure;
exports.dispatcher = dispatcher;

var _path = require('path');

var _fs = require('fs');

var _available = require('./available');

var _available2 = _interopRequireDefault(_available);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _develop = require('./develop');

var _develop2 = _interopRequireDefault(_develop);

var _exporter = require('./exporter');

var _exporter2 = _interopRequireDefault(_exporter);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _importer = require('./importer');

var _importer2 = _interopRequireDefault(_importer);

var _listen = require('./listen');

var _listen2 = _interopRequireDefault(_listen);

var _publish = require('./publish');

var _publish2 = _interopRequireDefault(_publish);

var _run = require('./run');

var _run2 = _interopRequireDefault(_run);

var _repl = require('./repl');

var _repl2 = _interopRequireDefault(_repl);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = exports.commands = {
  available: _available2.default,
  build: _build2.default,
  console: _repl2.default,
  create: _create2.default,
  develop: _develop2.default,
  export: _exporter2.default,
  import: _importer2.default,
  listen: _listen2.default,
  publish: _publish2.default,
  run: _run2.default
};

function configure(program, localConfig) {
  var handler = dispatcher.bind(program);

  (0, _available2.default)(program, handler);
  (0, _build2.default)(program, handler);
  (0, _repl2.default)(program, handler);
  (0, _create2.default)(program, handler);
  (0, _develop2.default)(program, handler);
  (0, _exporter2.default)(program, handler);
  (0, _init2.default)(program, handler);
  (0, _importer2.default)(program, handler);
  (0, _listen2.default)(program, handler);
  (0, _publish2.default)(program, handler);
  (0, _run2.default)(program, handler);
}

function dispatcher(handlerFn) {
  var program = this;

  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var project;
    var options;

    options = args[args.length - 1] || {};

    try {
      project = (0, _util.loadProjectFromDirectory)(options.project || options.parent && options.parent.project || process.env.PWD);
    } catch (error) {
      console.log('Error loading the skypager project'.red);
      console.log(error.message);
    }

    // create a context argument that is available
    // in addition to the options arg. this will have things available
    // that are shared across every cli handler, e.g. the project object
    args.push({
      project: project,
      program: program
    });

    handlerFn.apply(undefined, args);
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUE4QmdCLFNBQVMsR0FBVCxTQUFTO1FBZ0JULFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE3Qm5CLElBQU0sUUFBUSxXQUFSLFFBQVEsR0FBRztBQUN0QixXQUFTLHFCQUFBO0FBQ1QsT0FBSyxpQkFBQTtBQUNMLFNBQU8sZ0JBQU07QUFDYixRQUFNLGtCQUFBO0FBQ04sU0FBTyxtQkFBQTtBQUNQLFFBQU0sb0JBQVU7QUFDaEIsUUFBTSxvQkFBVTtBQUNoQixRQUFNLGtCQUFBO0FBQ04sU0FBTyxtQkFBQTtBQUNQLEtBQUcsZUFBQTtDQUNKLENBQUE7O0FBRU0sU0FBUyxTQUFTLENBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRTtBQUMvQyxNQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUV0QywyQkFBVSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0IsdUJBQU0sT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZCLHNCQUFLLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN0Qix3QkFBTyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDeEIseUJBQVEsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3pCLDBCQUFTLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMxQixzQkFBSyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdEIsMEJBQVMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzFCLHdCQUFPLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN4Qix5QkFBUSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDekIscUJBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0NBQ3RCOztBQUVNLFNBQVMsVUFBVSxDQUFDLFNBQVMsRUFBRTtBQUNwQyxNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRWxCLFNBQU8sWUFBYTtzQ0FBVCxJQUFJO0FBQUosVUFBSTs7O0FBQ2IsUUFBSSxPQUFPLENBQUE7QUFDWCxRQUFJLE9BQU8sQ0FBQTs7QUFFWCxXQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUVyQyxRQUFJO0FBQ0YsYUFBTyxHQUFHLFVBekNQLHdCQUF3QixFQXlDUSxPQUFPLENBQUMsT0FBTyxJQUFLLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEFBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3JILENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3JELGFBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzNCOzs7OztBQUFBLEFBS0QsUUFBSSxDQUFDLElBQUksQ0FBQztBQUNSLGFBQU8sRUFBUCxPQUFPO0FBQ1AsYUFBTyxFQUFQLE9BQU87S0FDUixDQUFDLENBQUE7O0FBRUYsYUFBUyxrQkFBSSxJQUFJLENBQUMsQ0FBQTtHQUNuQixDQUFBO0NBQ0YiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzIH0gZnJvbSAnZnMnXG5cbmltcG9ydCBhdmFpbGFibGUgZnJvbSAnLi9hdmFpbGFibGUnXG5pbXBvcnQgYnVpbGQgZnJvbSAnLi9idWlsZCdcbmltcG9ydCBjcmVhdGUgZnJvbSAnLi9jcmVhdGUnXG5pbXBvcnQgZGV2ZWxvcCBmcm9tICcuL2RldmVsb3AnXG5pbXBvcnQgZXhwb3J0ZXIgZnJvbSAnLi9leHBvcnRlcidcbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCdcbmltcG9ydCBpbXBvcnRlciBmcm9tICcuL2ltcG9ydGVyJ1xuaW1wb3J0IGxpc3RlbiBmcm9tICcuL2xpc3RlbidcbmltcG9ydCBwdWJsaXNoIGZyb20gJy4vcHVibGlzaCdcbmltcG9ydCBydW4gZnJvbSAnLi9ydW4nXG5pbXBvcnQgcmVwbCBmcm9tICcuL3JlcGwnXG5cbmltcG9ydCB7IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeSB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBjb25zdCBjb21tYW5kcyA9IHtcbiAgYXZhaWxhYmxlLFxuICBidWlsZCxcbiAgY29uc29sZTogcmVwbCxcbiAgY3JlYXRlLFxuICBkZXZlbG9wLFxuICBleHBvcnQ6IGV4cG9ydGVyLFxuICBpbXBvcnQ6IGltcG9ydGVyLFxuICBsaXN0ZW4sXG4gIHB1Ymxpc2gsXG4gIHJ1blxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlIChwcm9ncmFtLCBsb2NhbENvbmZpZykge1xuICBsZXQgaGFuZGxlciA9IGRpc3BhdGNoZXIuYmluZChwcm9ncmFtKVxuXG4gIGF2YWlsYWJsZShwcm9ncmFtLCBoYW5kbGVyKVxuICBidWlsZChwcm9ncmFtLCBoYW5kbGVyKVxuICByZXBsKHByb2dyYW0sIGhhbmRsZXIpXG4gIGNyZWF0ZShwcm9ncmFtLCBoYW5kbGVyKVxuICBkZXZlbG9wKHByb2dyYW0sIGhhbmRsZXIpXG4gIGV4cG9ydGVyKHByb2dyYW0sIGhhbmRsZXIpXG4gIGluaXQocHJvZ3JhbSwgaGFuZGxlcilcbiAgaW1wb3J0ZXIocHJvZ3JhbSwgaGFuZGxlcilcbiAgbGlzdGVuKHByb2dyYW0sIGhhbmRsZXIpXG4gIHB1Ymxpc2gocHJvZ3JhbSwgaGFuZGxlcilcbiAgcnVuKHByb2dyYW0sIGhhbmRsZXIpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaGVyKGhhbmRsZXJGbikge1xuICBsZXQgcHJvZ3JhbSA9IHRoaXNcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICB2YXIgcHJvamVjdFxuICAgIHZhciBvcHRpb25zXG5cbiAgICBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIHx8IHt9XG5cbiAgICB0cnkge1xuICAgICAgcHJvamVjdCA9IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeShvcHRpb25zLnByb2plY3QgfHwgKG9wdGlvbnMucGFyZW50ICYmIG9wdGlvbnMucGFyZW50LnByb2plY3QpIHx8IHByb2Nlc3MuZW52LlBXRClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmcgdGhlIHNreXBhZ2VyIHByb2plY3QnLnJlZClcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgY29udGV4dCBhcmd1bWVudCB0aGF0IGlzIGF2YWlsYWJsZVxuICAgIC8vIGluIGFkZGl0aW9uIHRvIHRoZSBvcHRpb25zIGFyZy4gdGhpcyB3aWxsIGhhdmUgdGhpbmdzIGF2YWlsYWJsZVxuICAgIC8vIHRoYXQgYXJlIHNoYXJlZCBhY3Jvc3MgZXZlcnkgY2xpIGhhbmRsZXIsIGUuZy4gdGhlIHByb2plY3Qgb2JqZWN0XG4gICAgYXJncy5wdXNoKHtcbiAgICAgIHByb2plY3QsXG4gICAgICBwcm9ncmFtXG4gICAgfSlcblxuICAgIGhhbmRsZXJGbiguLi5hcmdzKVxuICB9XG59XG4iXX0=