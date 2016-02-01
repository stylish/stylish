'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repl = repl;
exports.handle = handle;
function repl(program, dispatch) {
  program.command('console').description('Run an interactive REPL within the project').option('--es6', 'require babel-register and polyfill').action(dispatch(handle));
}

exports.default = repl;
function handle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var replServer = require('repl').start({
    prompt: 'skypager'.magenta + ':'.cyan + ' '
  });

  Object.keys(context).forEach(function (key) {
    replServer.context[key] = context[key];
    replServer.context.keys = Object.keys(context);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21tYW5kcy9yZXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLElBQUksR0FBSixJQUFJO1FBVUosTUFBTSxHQUFOLE1BQU07QUFWZixTQUFTLElBQUksQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3ZDLFNBQU8sQ0FDSixPQUFPLENBQUMsU0FBUyxDQUFDLENBQ2xCLFdBQVcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUN6RCxNQUFNLENBQUMsT0FBTyxFQUFFLHFDQUFxQyxDQUFDLENBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7a0JBRWMsSUFBSTtBQUVaLFNBQVMsTUFBTSxHQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ2hELE1BQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckMsVUFBTSxFQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEFBQUM7R0FDOUMsQ0FBQyxDQUFBOztBQUVGLFFBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2xDLGNBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RDLGNBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBO0NBQ0giLCJmaWxlIjoicmVwbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiByZXBsIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2NvbnNvbGUnKVxuICAgIC5kZXNjcmlwdGlvbignUnVuIGFuIGludGVyYWN0aXZlIFJFUEwgd2l0aGluIHRoZSBwcm9qZWN0JylcbiAgICAub3B0aW9uKCctLWVzNicsICdyZXF1aXJlIGJhYmVsLXJlZ2lzdGVyIGFuZCBwb2x5ZmlsbCcpXG4gICAgLmFjdGlvbihkaXNwYXRjaChoYW5kbGUpKVxufVxuXG5leHBvcnQgZGVmYXVsdCByZXBsXG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGUgKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gIHZhciByZXBsU2VydmVyID0gcmVxdWlyZSgncmVwbCcpLnN0YXJ0KHtcbiAgICBwcm9tcHQ6ICgnc2t5cGFnZXInLm1hZ2VudGEgKyAnOicuY3lhbiArICcgJylcbiAgfSlcblxuICBPYmplY3Qua2V5cyhjb250ZXh0KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgcmVwbFNlcnZlci5jb250ZXh0W2tleV0gPSBjb250ZXh0W2tleV1cbiAgICByZXBsU2VydmVyLmNvbnRleHQua2V5cyA9IE9iamVjdC5rZXlzKGNvbnRleHQpXG4gIH0pXG59XG4iXX0=