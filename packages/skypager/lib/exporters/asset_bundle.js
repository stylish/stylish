"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionBundle = CollectionBundle;
function CollectionBundle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project = options.project || this;

  if (options.project && !options.asset) {
    var re = ProjectExporter.call(options.project, options);
    return re;
  }

  if (options.asset) {
    return AssetExporter.call(options.asset, options);
  }
}

function ProjectExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project;

  var keys = Object.keys(project.content);

  var obj = {};

  keys.forEach(function (key) {
    var collection = project.content[key];

    obj[key] = collection.reduce(function (memo, asset) {
      memo[asset.paths.project] = AssetExporter.call(asset);
      return memo;
    }, {});
  });

  return obj;
}

function AssetExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var asset = options.asset || this;

  return {
    id: asset.id,
    uri: asset.uri,
    fingerprint: asset.fingerprint,
    loaderString: asset.loaderString,
    path: asset.paths.project
  };
}

exports.default = AssetManifest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYXNzZXRfYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLGdCQUFnQixHQUFoQixnQkFBZ0I7QUFBekIsU0FBUyxnQkFBZ0IsR0FBYztNQUFiLE9BQU8seURBQUcsRUFBRTs7QUFDM0MsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQTs7QUFFdkQsTUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNyQyxRQUFJLEVBQUUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDdkQsV0FBTyxFQUFFLENBQUE7R0FDVjs7QUFFRCxNQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDakIsV0FBTyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7R0FDbEQ7Q0FFRjs7QUFFRCxTQUFTLGVBQWUsR0FBYztNQUFiLE9BQU8seURBQUcsRUFBRTs7QUFDbkMsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQTs7QUFFN0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRXpDLE1BQUksR0FBRyxHQUFJLEVBQUUsQ0FBQTs7QUFFYixNQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2xCLFFBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7O0FBRXJDLE9BQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFDLEtBQUssRUFBSztBQUMzQyxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFBO0FBQ3JELGFBQU8sSUFBSSxDQUFBO0tBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtHQUNQLENBQUMsQ0FBQTs7QUFFRixTQUFPLEdBQUcsQ0FBQTtDQUNYOztBQUVELFNBQVMsYUFBYSxHQUFjO01BQWIsT0FBTyx5REFBRyxFQUFFOztBQUNqQyxNQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQTs7QUFFakMsU0FBTztBQUNMLE1BQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtBQUNaLE9BQUcsRUFBRSxLQUFLLENBQUMsR0FBRztBQUNkLGVBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztBQUM5QixnQkFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO0FBQ2hDLFFBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU87R0FDMUIsQ0FBQTtDQUNGOztrQkFFYyxhQUFhIiwiZmlsZSI6ImFzc2V0X2J1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBDb2xsZWN0aW9uQnVuZGxlKG9wdGlvbnMgPSB7fSl7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0IHx8IHRoaXNcblxuICBpZiAob3B0aW9ucy5wcm9qZWN0ICYmICFvcHRpb25zLmFzc2V0KSB7ICBcbiAgICBsZXQgcmUgPSBQcm9qZWN0RXhwb3J0ZXIuY2FsbChvcHRpb25zLnByb2plY3QsIG9wdGlvbnMpXG4gICAgcmV0dXJuIHJlXG4gIH1cblxuICBpZiAob3B0aW9ucy5hc3NldCkge1xuICAgIHJldHVybiBBc3NldEV4cG9ydGVyLmNhbGwob3B0aW9ucy5hc3NldCwgb3B0aW9ucylcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFByb2plY3RFeHBvcnRlcihvcHRpb25zID0ge30pe1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdFxuXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9qZWN0LmNvbnRlbnQpXG4gIFxuICBsZXQgb2JqID0gIHt9XG4gIFxuICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICBsZXQgY29sbGVjdGlvbiA9IHByb2plY3QuY29udGVudFtrZXldXG4gICAgXG4gICAgb2JqW2tleV0gPSBjb2xsZWN0aW9uLnJlZHVjZSgobWVtbyxhc3NldCkgPT4ge1xuICAgICAgbWVtb1thc3NldC5wYXRocy5wcm9qZWN0XSA9IEFzc2V0RXhwb3J0ZXIuY2FsbChhc3NldClcbiAgICAgIHJldHVybiBtZW1vXG4gICAgfSwge30pXG4gIH0pXG4gIFxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIEFzc2V0RXhwb3J0ZXIob3B0aW9ucyA9IHt9KXtcbiAgbGV0IGFzc2V0ID0gb3B0aW9ucy5hc3NldCB8fCB0aGlzXG5cbiAgcmV0dXJuIHtcbiAgICBpZDogYXNzZXQuaWQsXG4gICAgdXJpOiBhc3NldC51cmksXG4gICAgZmluZ2VycHJpbnQ6IGFzc2V0LmZpbmdlcnByaW50LFxuICAgIGxvYWRlclN0cmluZzogYXNzZXQubG9hZGVyU3RyaW5nLFxuICAgIHBhdGg6IGFzc2V0LnBhdGhzLnByb2plY3RcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBc3NldE1hbmlmZXN0XG4iXX0=