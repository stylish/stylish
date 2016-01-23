'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repl = exports.run = exports.publish = exports.listen = exports.init = exports.develop = exports.build = exports.available = undefined;
exports.dispatcher = dispatcher;

var _available2 = require('./available');

var _available3 = _interopRequireDefault(_available2);

var _build2 = require('./build');

var _build3 = _interopRequireDefault(_build2);

var _develop2 = require('./develop');

var _develop3 = _interopRequireDefault(_develop2);

var _init2 = require('./init');

var _init3 = _interopRequireDefault(_init2);

var _listen2 = require('./listen');

var _listen3 = _interopRequireDefault(_listen2);

var _publish2 = require('./publish');

var _publish3 = _interopRequireDefault(_publish2);

var _run2 = require('./run');

var _run3 = _interopRequireDefault(_run2);

var _repl2 = require('./repl');

var _repl3 = _interopRequireDefault(_repl2);

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.available = _available3.default;
exports.build = _build3.default;
exports.develop = _develop3.default;
exports.init = _init3.default;
exports.listen = _listen3.default;
exports.publish = _publish3.default;
exports.run = _run3.default;
exports.repl = _repl3.default;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBV2dCLFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQVhuQixTQUFTO1FBQ1QsS0FBSztRQUNMLE9BQU87UUFDUCxJQUFJO1FBQ0osTUFBTTtRQUNOLE9BQU87UUFDUCxHQUFHO1FBQ0gsSUFBSTtBQUlKLFNBQVMsVUFBVSxDQUFDLFNBQVMsRUFBRTtBQUNwQyxNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRWxCLFNBQU8sWUFBYTtzQ0FBVCxJQUFJO0FBQUosVUFBSTs7O0FBQ2IsUUFBSSxPQUFPLENBQUE7QUFDWCxRQUFJLE9BQU8sQ0FBQTs7QUFFWCxXQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBOztBQUVyQyxRQUFJO0FBQ0YsYUFBTyxHQUFHLFVBWlAsd0JBQXdCLEVBWVEsT0FBTyxDQUFDLE9BQU8sSUFBSyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxBQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNySCxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNyRCxhQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUMzQjs7Ozs7QUFBQSxBQUtELFFBQUksQ0FBQyxJQUFJLENBQUM7QUFDUixhQUFPLEVBQVAsT0FBTztBQUNQLGFBQU8sRUFBUCxPQUFPO0tBQ1IsQ0FBQyxDQUFBOztBQUVGLGFBQVMsa0JBQUksSUFBSSxDQUFDLENBQUE7R0FDbkIsQ0FBQTtDQUNGIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGF2YWlsYWJsZSBmcm9tICcuL2F2YWlsYWJsZSdcbmV4cG9ydCBidWlsZCBmcm9tICcuL2J1aWxkJ1xuZXhwb3J0IGRldmVsb3AgZnJvbSAnLi9kZXZlbG9wJ1xuZXhwb3J0IGluaXQgZnJvbSAnLi9pbml0J1xuZXhwb3J0IGxpc3RlbiBmcm9tICcuL2xpc3RlbidcbmV4cG9ydCBwdWJsaXNoIGZyb20gJy4vcHVibGlzaCdcbmV4cG9ydCBydW4gZnJvbSAnLi9ydW4nXG5leHBvcnQgcmVwbCBmcm9tICcuL3JlcGwnXG5cbmltcG9ydCB7IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeSB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaGVyKGhhbmRsZXJGbikge1xuICBsZXQgcHJvZ3JhbSA9IHRoaXNcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICB2YXIgcHJvamVjdFxuICAgIHZhciBvcHRpb25zXG5cbiAgICBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIHx8IHt9XG5cbiAgICB0cnkge1xuICAgICAgcHJvamVjdCA9IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeShvcHRpb25zLnByb2plY3QgfHwgKG9wdGlvbnMucGFyZW50ICYmIG9wdGlvbnMucGFyZW50LnByb2plY3QpIHx8IHByb2Nlc3MuZW52LlBXRClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmcgdGhlIHNreXBhZ2VyIHByb2plY3QnLnJlZClcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgY29udGV4dCBhcmd1bWVudCB0aGF0IGlzIGF2YWlsYWJsZVxuICAgIC8vIGluIGFkZGl0aW9uIHRvIHRoZSBvcHRpb25zIGFyZy4gdGhpcyB3aWxsIGhhdmUgdGhpbmdzIGF2YWlsYWJsZVxuICAgIC8vIHRoYXQgYXJlIHNoYXJlZCBhY3Jvc3MgZXZlcnkgY2xpIGhhbmRsZXIsIGUuZy4gdGhlIHByb2plY3Qgb2JqZWN0XG4gICAgYXJncy5wdXNoKHtcbiAgICAgIHByb2plY3QsXG4gICAgICBwcm9ncmFtXG4gICAgfSlcblxuICAgIGhhbmRsZXJGbiguLi5hcmdzKVxuICB9XG59XG4iXX0=