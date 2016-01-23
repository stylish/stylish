'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.handle = handle;
function run(program, dispatch) {
  program.command('run <helper> [type]').option('--type', 'what type of helper is it? app, action, importer, exporter', 'action').action(dispatch(handle));
}

exports.default = run;
function handle(helper, helperType) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  console.log('todo handle run cli');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLEdBQUcsR0FBSCxHQUFHO1FBU0gsTUFBTSxHQUFOLE1BQU07QUFUZixTQUFTLEdBQUcsQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3RDLFNBQU8sQ0FDSixPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FDOUIsTUFBTSxDQUFDLFFBQVEsRUFBRSw0REFBNEQsRUFBRSxRQUFRLENBQUMsQ0FDeEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0NBQzVCOztrQkFFYyxHQUFHO0FBRVgsU0FBUyxNQUFNLENBQUUsTUFBTSxFQUFFLFVBQVUsRUFBOEI7TUFBNUIsT0FBTyx5REFBRyxFQUFFO01BQUUsT0FBTyx5REFBRyxFQUFFOztBQUNwRSxTQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUE7Q0FDbkMiLCJmaWxlIjoicnVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHJ1biAocHJvZ3JhbSwgZGlzcGF0Y2gpIHtcbiAgcHJvZ3JhbVxuICAgIC5jb21tYW5kKCdydW4gPGhlbHBlcj4gW3R5cGVdJylcbiAgICAub3B0aW9uKCctLXR5cGUnLCAnd2hhdCB0eXBlIG9mIGhlbHBlciBpcyBpdD8gYXBwLCBhY3Rpb24sIGltcG9ydGVyLCBleHBvcnRlcicsICdhY3Rpb24nKVxuICAgIC5hY3Rpb24oZGlzcGF0Y2goaGFuZGxlKSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgcnVuXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKGhlbHBlciwgaGVscGVyVHlwZSwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgY29uc29sZS5sb2coJ3RvZG8gaGFuZGxlIHJ1biBjbGknKVxufVxuIl19