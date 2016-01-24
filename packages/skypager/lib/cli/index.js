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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBOEJnQixTQUFTLEdBQVQsU0FBUztRQWdCVCxVQUFVLEdBQVYsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBN0JuQixJQUFNLFFBQVEsV0FBUixRQUFRLEdBQUc7QUFDdEIsV0FBUyxxQkFBQTtBQUNULE9BQUssaUJBQUE7QUFDTCxTQUFPLGdCQUFNO0FBQ2IsUUFBTSxrQkFBQTtBQUNOLFNBQU8sbUJBQUE7QUFDUCxRQUFNLG9CQUFVO0FBQ2hCLFFBQU0sb0JBQVU7QUFDaEIsUUFBTSxrQkFBQTtBQUNOLFNBQU8sbUJBQUE7QUFDUCxLQUFHLGVBQUE7Q0FDSixDQUFBOztBQUVNLFNBQVMsU0FBUyxDQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7QUFDL0MsTUFBSSxPQUFPLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFdEMsMkJBQVUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQzNCLHVCQUFNLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN2QixzQkFBSyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdEIsd0JBQU8sT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3hCLHlCQUFRLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN6QiwwQkFBUyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDMUIsc0JBQUssT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3RCLDBCQUFTLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMxQix3QkFBTyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDeEIseUJBQVEsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3pCLHFCQUFJLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtDQUN0Qjs7QUFFTSxTQUFTLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDcEMsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLFlBQWE7c0NBQVQsSUFBSTtBQUFKLFVBQUk7OztBQUNiLFFBQUksT0FBTyxDQUFBO0FBQ1gsUUFBSSxPQUFPLENBQUE7O0FBRVgsV0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTs7QUFFckMsUUFBSTtBQUNGLGFBQU8sR0FBRyxVQXpDUCx3QkFBd0IsRUF5Q1EsT0FBTyxDQUFDLE9BQU8sSUFBSyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxBQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNySCxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNyRCxhQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUMzQjs7Ozs7QUFBQSxBQUtELFFBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixhQUFPLEVBQVAsT0FBTztBQUNQLGFBQU8sRUFBUCxPQUFPO0tBQ1IsQ0FBQyxDQUFBOztBQUVGLGFBQVMsa0JBQUksSUFBSSxDQUFDLENBQUE7R0FDbkIsQ0FBQTtDQUNGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBleGlzdHNTeW5jIGFzIGV4aXN0cyB9IGZyb20gJ2ZzJ1xuXG5pbXBvcnQgYXZhaWxhYmxlIGZyb20gJy4vYXZhaWxhYmxlJ1xuaW1wb3J0IGJ1aWxkIGZyb20gJy4vYnVpbGQnXG5pbXBvcnQgY3JlYXRlIGZyb20gJy4vY3JlYXRlJ1xuaW1wb3J0IGRldmVsb3AgZnJvbSAnLi9kZXZlbG9wJ1xuaW1wb3J0IGV4cG9ydGVyIGZyb20gJy4vZXhwb3J0ZXInXG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnXG5pbXBvcnQgaW1wb3J0ZXIgZnJvbSAnLi9pbXBvcnRlcidcbmltcG9ydCBsaXN0ZW4gZnJvbSAnLi9saXN0ZW4nXG5pbXBvcnQgcHVibGlzaCBmcm9tICcuL3B1Ymxpc2gnXG5pbXBvcnQgcnVuIGZyb20gJy4vcnVuJ1xuaW1wb3J0IHJlcGwgZnJvbSAnLi9yZXBsJ1xuXG5pbXBvcnQgeyBsb2FkUHJvamVjdEZyb21EaXJlY3RvcnkgfSBmcm9tICcuLi91dGlsJ1xuXG5leHBvcnQgY29uc3QgY29tbWFuZHMgPSB7XG4gIGF2YWlsYWJsZSxcbiAgYnVpbGQsXG4gIGNvbnNvbGU6IHJlcGwsXG4gIGNyZWF0ZSxcbiAgZGV2ZWxvcCxcbiAgZXhwb3J0OiBleHBvcnRlcixcbiAgaW1wb3J0OiBpbXBvcnRlcixcbiAgbGlzdGVuLFxuICBwdWJsaXNoLFxuICBydW5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZSAocHJvZ3JhbSwgbG9jYWxDb25maWcpIHtcbiAgbGV0IGhhbmRsZXIgPSBkaXNwYXRjaGVyLmJpbmQocHJvZ3JhbSlcblxuICBhdmFpbGFibGUocHJvZ3JhbSwgaGFuZGxlcilcbiAgYnVpbGQocHJvZ3JhbSwgaGFuZGxlcilcbiAgcmVwbChwcm9ncmFtLCBoYW5kbGVyKVxuICBjcmVhdGUocHJvZ3JhbSwgaGFuZGxlcilcbiAgZGV2ZWxvcChwcm9ncmFtLCBoYW5kbGVyKVxuICBleHBvcnRlcihwcm9ncmFtLCBoYW5kbGVyKVxuICBpbml0KHByb2dyYW0sIGhhbmRsZXIpXG4gIGltcG9ydGVyKHByb2dyYW0sIGhhbmRsZXIpXG4gIGxpc3Rlbihwcm9ncmFtLCBoYW5kbGVyKVxuICBwdWJsaXNoKHByb2dyYW0sIGhhbmRsZXIpXG4gIHJ1bihwcm9ncmFtLCBoYW5kbGVyKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hlcihoYW5kbGVyRm4pIHtcbiAgbGV0IHByb2dyYW0gPSB0aGlzXG5cbiAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgdmFyIHByb2plY3RcbiAgICB2YXIgb3B0aW9uc1xuXG4gICAgb3B0aW9ucyA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXSB8fCB7fVxuXG4gICAgdHJ5IHtcbiAgICAgIHByb2plY3QgPSBsb2FkUHJvamVjdEZyb21EaXJlY3Rvcnkob3B0aW9ucy5wcm9qZWN0IHx8IChvcHRpb25zLnBhcmVudCAmJiBvcHRpb25zLnBhcmVudC5wcm9qZWN0KSB8fCBwcm9jZXNzLmVudi5QV0QpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nIHRoZSBza3lwYWdlciBwcm9qZWN0Jy5yZWQpXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5tZXNzYWdlKVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhIGNvbnRleHQgYXJndW1lbnQgdGhhdCBpcyBhdmFpbGFibGVcbiAgICAvLyBpbiBhZGRpdGlvbiB0byB0aGUgb3B0aW9ucyBhcmcuIHRoaXMgd2lsbCBoYXZlIHRoaW5ncyBhdmFpbGFibGVcbiAgICAvLyB0aGF0IGFyZSBzaGFyZWQgYWNyb3NzIGV2ZXJ5IGNsaSBoYW5kbGVyLCBlLmcuIHRoZSBwcm9qZWN0IG9iamVjdFxuICAgIGFyZ3MucHVzaCh7XG4gICAgICBwcm9qZWN0LFxuICAgICAgcHJvZ3JhbVxuICAgIH0pXG5cbiAgICBoYW5kbGVyRm4oLi4uYXJncylcbiAgfVxufVxuIl19