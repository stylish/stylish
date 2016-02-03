'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = undefined;
exports.configure = configure;
exports.dispatcher = dispatcher;

var _path = require('path');

var _fs = require('fs');

var _author = require('./author');

var _author2 = _interopRequireDefault(_author);

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
  author: _author2.default,
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

  (0, _author2.default)(program, handler);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFnQ2dCLFNBQVMsR0FBVCxTQUFTO1FBaUJULFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBL0JuQixJQUFNLFFBQVEsV0FBUixRQUFRLEdBQUc7QUFDdEIsUUFBTSxrQkFBQTtBQUNOLFdBQVMscUJBQUE7QUFDVCxPQUFLLGlCQUFBO0FBQ0wsU0FBTyxnQkFBTTtBQUNiLFFBQU0sa0JBQUE7QUFDTixTQUFPLG1CQUFBO0FBQ1AsUUFBTSxvQkFBVTtBQUNoQixRQUFNLG9CQUFVO0FBQ2hCLFFBQU0sa0JBQUE7QUFDTixTQUFPLG1CQUFBO0FBQ1AsS0FBRyxlQUFBO0NBQ0osQ0FBQTs7QUFFTSxTQUFTLFNBQVMsQ0FBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO0FBQy9DLE1BQUksT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXRDLHdCQUFPLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN4QiwyQkFBVSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDM0IsdUJBQU0sT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZCLHNCQUFLLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN0Qix3QkFBTyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDeEIseUJBQVEsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3pCLDBCQUFTLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMxQixzQkFBSyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdEIsMEJBQVMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzFCLHdCQUFPLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN4Qix5QkFBUSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDekIscUJBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0NBQ3RCOztBQUVNLFNBQVMsVUFBVSxDQUFDLFNBQVMsRUFBRTtBQUNwQyxNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRWxCLFNBQU8sWUFBYTtzQ0FBVCxJQUFJO0FBQUosVUFBSTs7O0FBQ2IsUUFBSSxPQUFPLENBQUE7QUFDWCxRQUFJLE9BQU8sQ0FBQTs7QUFFWCxXQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUVyQyxRQUFJO0FBQ0YsYUFBTyxHQUFHLFVBM0NQLHdCQUF3QixFQTJDUSxPQUFPLENBQUMsT0FBTyxJQUFLLE9BQU8sQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEFBQUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3JILENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3JELGFBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzNCOzs7OztBQUFBLEFBS0QsUUFBSSxDQUFDLElBQUksQ0FBQztBQUNSLGFBQU8sRUFBUCxPQUFPO0FBQ1AsYUFBTyxFQUFQLE9BQU87S0FDUixDQUFDLENBQUE7O0FBRUYsYUFBUyxrQkFBSSxJQUFJLENBQUMsQ0FBQTtHQUNuQixDQUFBO0NBQ0YiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBqb2luLCByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IGV4aXN0c1N5bmMgYXMgZXhpc3RzIH0gZnJvbSAnZnMnXG5cbmltcG9ydCBhdXRob3IgZnJvbSAnLi9hdXRob3InXG5pbXBvcnQgYXZhaWxhYmxlIGZyb20gJy4vYXZhaWxhYmxlJ1xuaW1wb3J0IGJ1aWxkIGZyb20gJy4vYnVpbGQnXG5pbXBvcnQgY3JlYXRlIGZyb20gJy4vY3JlYXRlJ1xuaW1wb3J0IGRldmVsb3AgZnJvbSAnLi9kZXZlbG9wJ1xuaW1wb3J0IGV4cG9ydGVyIGZyb20gJy4vZXhwb3J0ZXInXG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnXG5pbXBvcnQgaW1wb3J0ZXIgZnJvbSAnLi9pbXBvcnRlcidcbmltcG9ydCBsaXN0ZW4gZnJvbSAnLi9saXN0ZW4nXG5pbXBvcnQgcHVibGlzaCBmcm9tICcuL3B1Ymxpc2gnXG5pbXBvcnQgcnVuIGZyb20gJy4vcnVuJ1xuaW1wb3J0IHJlcGwgZnJvbSAnLi9yZXBsJ1xuXG5pbXBvcnQgeyBsb2FkUHJvamVjdEZyb21EaXJlY3RvcnkgfSBmcm9tICcuLi91dGlsJ1xuXG5leHBvcnQgY29uc3QgY29tbWFuZHMgPSB7XG4gIGF1dGhvcixcbiAgYXZhaWxhYmxlLFxuICBidWlsZCxcbiAgY29uc29sZTogcmVwbCxcbiAgY3JlYXRlLFxuICBkZXZlbG9wLFxuICBleHBvcnQ6IGV4cG9ydGVyLFxuICBpbXBvcnQ6IGltcG9ydGVyLFxuICBsaXN0ZW4sXG4gIHB1Ymxpc2gsXG4gIHJ1blxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlIChwcm9ncmFtLCBsb2NhbENvbmZpZykge1xuICBsZXQgaGFuZGxlciA9IGRpc3BhdGNoZXIuYmluZChwcm9ncmFtKVxuXG4gIGF1dGhvcihwcm9ncmFtLCBoYW5kbGVyKVxuICBhdmFpbGFibGUocHJvZ3JhbSwgaGFuZGxlcilcbiAgYnVpbGQocHJvZ3JhbSwgaGFuZGxlcilcbiAgcmVwbChwcm9ncmFtLCBoYW5kbGVyKVxuICBjcmVhdGUocHJvZ3JhbSwgaGFuZGxlcilcbiAgZGV2ZWxvcChwcm9ncmFtLCBoYW5kbGVyKVxuICBleHBvcnRlcihwcm9ncmFtLCBoYW5kbGVyKVxuICBpbml0KHByb2dyYW0sIGhhbmRsZXIpXG4gIGltcG9ydGVyKHByb2dyYW0sIGhhbmRsZXIpXG4gIGxpc3Rlbihwcm9ncmFtLCBoYW5kbGVyKVxuICBwdWJsaXNoKHByb2dyYW0sIGhhbmRsZXIpXG4gIHJ1bihwcm9ncmFtLCBoYW5kbGVyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hlcihoYW5kbGVyRm4pIHtcbiAgbGV0IHByb2dyYW0gPSB0aGlzXG5cbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgdmFyIHByb2plY3RcbiAgICB2YXIgb3B0aW9uc1xuXG4gICAgb3B0aW9ucyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXSB8fCB7fVxuXG4gICAgdHJ5IHtcbiAgICAgIHByb2plY3QgPSBsb2FkUHJvamVjdEZyb21EaXJlY3Rvcnkob3B0aW9ucy5wcm9qZWN0IHx8IChvcHRpb25zLnBhcmVudCAmJiBvcHRpb25zLnBhcmVudC5wcm9qZWN0KSB8fCBwcm9jZXNzLmVudi5QV0QpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nIHRoZSBza3lwYWdlciBwcm9qZWN0Jy5yZWQpXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIGNvbnRleHQgYXJndW1lbnQgdGhhdCBpcyBhdmFpbGFibGVcbiAgICAvLyBpbiBhZGRpdGlvbiB0byB0aGUgb3B0aW9ucyBhcmcuIHRoaXMgd2lsbCBoYXZlIHRoaW5ncyBhdmFpbGFibGVcbiAgICAvLyB0aGF0IGFyZSBzaGFyZWQgYWNyb3NzIGV2ZXJ5IGNsaSBoYW5kbGVyLCBlLmcuIHRoZSBwcm9qZWN0IG9iamVjdFxuICAgIGFyZ3MucHVzaCh7XG4gICAgICBwcm9qZWN0LFxuICAgICAgcHJvZ3JhbVxuICAgIH0pXG5cbiAgICBoYW5kbGVyRm4oLi4uYXJncylcbiAgfVxufVxuIl19