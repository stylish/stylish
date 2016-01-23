'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repl = exports.run = exports.publish = exports.listen = exports.init = exports.develop = exports.build = undefined;
exports.dispatcher = dispatcher;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBVWdCLFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBVm5CLEtBQUs7UUFDTCxPQUFPO1FBQ1AsSUFBSTtRQUNKLE1BQU07UUFDTixPQUFPO1FBQ1AsR0FBRztRQUNILElBQUk7QUFJSixTQUFTLFVBQVUsQ0FBQyxTQUFTLEVBQUU7QUFDcEMsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLFlBQWE7c0NBQVQsSUFBSTtBQUFKLFVBQUk7OztBQUNiLFFBQUksT0FBTyxDQUFBO0FBQ1gsUUFBSSxPQUFPLENBQUE7O0FBRVgsV0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTs7QUFFckMsUUFBSTtBQUNGLGFBQU8sR0FBRyxVQVpQLHdCQUF3QixFQVlRLE9BQU8sQ0FBQyxPQUFPLElBQUssT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQUFBQyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDckgsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLGFBQU8sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDckQsYUFBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDM0I7Ozs7O0FBQUEsQUFLRCxRQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1IsYUFBTyxFQUFQLE9BQU87QUFDUCxhQUFPLEVBQVAsT0FBTztLQUNSLENBQUMsQ0FBQTs7QUFFRixhQUFTLGtCQUFJLElBQUksQ0FBQyxDQUFBO0dBQ25CLENBQUE7Q0FDRiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBidWlsZCBmcm9tICcuL2J1aWxkJ1xuZXhwb3J0IGRldmVsb3AgZnJvbSAnLi9kZXZlbG9wJ1xuZXhwb3J0IGluaXQgZnJvbSAnLi9pbml0J1xuZXhwb3J0IGxpc3RlbiBmcm9tICcuL2xpc3RlbidcbmV4cG9ydCBwdWJsaXNoIGZyb20gJy4vcHVibGlzaCdcbmV4cG9ydCBydW4gZnJvbSAnLi9ydW4nXG5leHBvcnQgcmVwbCBmcm9tICcuL3JlcGwnXG5cbmltcG9ydCB7IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeSB9IGZyb20gJy4uL3V0aWwnXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaGVyKGhhbmRsZXJGbikge1xuICBsZXQgcHJvZ3JhbSA9IHRoaXNcblxuICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcbiAgICB2YXIgcHJvamVjdFxuICAgIHZhciBvcHRpb25zXG5cbiAgICBvcHRpb25zID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIHx8IHt9XG5cbiAgICB0cnkge1xuICAgICAgcHJvamVjdCA9IGxvYWRQcm9qZWN0RnJvbURpcmVjdG9yeShvcHRpb25zLnByb2plY3QgfHwgKG9wdGlvbnMucGFyZW50ICYmIG9wdGlvbnMucGFyZW50LnByb2plY3QpIHx8IHByb2Nlc3MuZW52LlBXRClcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmcgdGhlIHNreXBhZ2VyIHByb2plY3QnLnJlZClcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuXG4gICAgLy8gY3JlYXRlIGEgY29udGV4dCBhcmd1bWVudCB0aGF0IGlzIGF2YWlsYWJsZVxuICAgIC8vIGluIGFkZGl0aW9uIHRvIHRoZSBvcHRpb25zIGFyZy4gdGhpcyB3aWxsIGhhdmUgdGhpbmdzIGF2YWlsYWJsZVxuICAgIC8vIHRoYXQgYXJlIHNoYXJlZCBhY3Jvc3MgZXZlcnkgY2xpIGhhbmRsZXIsIGUuZy4gdGhlIHByb2plY3Qgb2JqZWN0XG4gICAgYXJncy5wdXNoKHtcbiAgICAgIHByb2plY3QsXG4gICAgICBwcm9ncmFtXG4gICAgfSlcblxuICAgIGhhbmRsZXJGbiguLi5hcmdzKVxuICB9XG59XG4iXX0=