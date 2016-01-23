'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repl = repl;
exports.handle = handle;
function repl(program, dispatch) {
  program.command('console').option('--es6', 'require babel-register and polyfill').action(dispatch(handle));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcmVwbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUFnQixJQUFJLEdBQUosSUFBSTtRQVNKLE1BQU0sR0FBTixNQUFNO0FBVGYsU0FBUyxJQUFJLENBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN2QyxTQUFPLENBQ0osT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUNsQixNQUFNLENBQUMsT0FBTyxFQUFFLHFDQUFxQyxDQUFDLENBQ3RELE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtDQUM1Qjs7a0JBRWMsSUFBSTtBQUVaLFNBQVMsTUFBTSxHQUE4QjtNQUE1QixPQUFPLHlEQUFHLEVBQUU7TUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ2hELE1BQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDckMsVUFBTSxFQUFHLFVBQVUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEFBQUM7R0FDOUMsQ0FBQyxDQUFBOztBQUVGLFFBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2xDLGNBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3RDLGNBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7R0FDL0MsQ0FBQyxDQUFBO0NBQ0giLCJmaWxlIjoicmVwbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiByZXBsIChwcm9ncmFtLCBkaXNwYXRjaCkge1xuICBwcm9ncmFtXG4gICAgLmNvbW1hbmQoJ2NvbnNvbGUnKVxuICAgIC5vcHRpb24oJy0tZXM2JywgJ3JlcXVpcmUgYmFiZWwtcmVnaXN0ZXIgYW5kIHBvbHlmaWxsJylcbiAgICAuYWN0aW9uKGRpc3BhdGNoKGhhbmRsZSkpXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlcGxcblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZSAob3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgdmFyIHJlcGxTZXJ2ZXIgPSByZXF1aXJlKCdyZXBsJykuc3RhcnQoe1xuICAgIHByb21wdDogKCdza3lwYWdlcicubWFnZW50YSArICc6Jy5jeWFuICsgJyAnKVxuICB9KVxuXG4gIE9iamVjdC5rZXlzKGNvbnRleHQpLmZvckVhY2goa2V5ID0+IHtcbiAgICByZXBsU2VydmVyLmNvbnRleHRba2V5XSA9IGNvbnRleHRba2V5XVxuICAgIHJlcGxTZXJ2ZXIuY29udGV4dC5rZXlzID0gT2JqZWN0LmtleXMoY29udGV4dClcbiAgfSlcbn1cbiJdfQ==