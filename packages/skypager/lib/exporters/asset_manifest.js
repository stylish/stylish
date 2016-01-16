"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetManifest = AssetManifest;
function AssetManifest() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYXNzZXRfbWFuaWZlc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0IsYUFBYSxHQUFiLGFBQWE7QUFBdEIsU0FBUyxhQUFhLEdBQWM7TUFBYixPQUFPLHlEQUFHLEVBQUU7O0FBQ3hDLE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUE7O0FBRXZELE1BQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDckMsUUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3ZELFdBQU8sRUFBRSxDQUFBO0dBQ1Y7O0FBRUQsTUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ2pCLFdBQU8sYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0dBQ2xEO0NBRUY7O0FBRUQsU0FBUyxlQUFlLEdBQWM7TUFBYixPQUFPLHlEQUFHLEVBQUU7O0FBQ25DLE1BQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUE7O0FBRTdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBOztBQUV6QyxNQUFJLEdBQUcsR0FBSSxFQUFFLENBQUE7O0FBRWIsTUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNsQixRQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBOztBQUVyQyxPQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBQyxLQUFLLEVBQUs7QUFDM0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUNyRCxhQUFPLElBQUksQ0FBQTtLQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7R0FDUCxDQUFDLENBQUE7O0FBRUYsU0FBTyxHQUFHLENBQUE7Q0FDWDs7QUFFRCxTQUFTLGFBQWEsR0FBYztNQUFiLE9BQU8seURBQUcsRUFBRTs7QUFDakMsTUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUE7O0FBRWpDLFNBQU87QUFDTCxNQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDWixPQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7QUFDZCxlQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7QUFDOUIsZ0JBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtBQUNoQyxRQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPO0dBQzFCLENBQUE7Q0FDRjs7a0JBRWMsYUFBYSIsImZpbGUiOiJhc3NldF9tYW5pZmVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBBc3NldE1hbmlmZXN0KG9wdGlvbnMgPSB7fSl7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0IHx8IHRoaXNcblxuICBpZiAob3B0aW9ucy5wcm9qZWN0ICYmICFvcHRpb25zLmFzc2V0KSB7ICBcbiAgICBsZXQgcmUgPSBQcm9qZWN0RXhwb3J0ZXIuY2FsbChvcHRpb25zLnByb2plY3QsIG9wdGlvbnMpXG4gICAgcmV0dXJuIHJlXG4gIH1cblxuICBpZiAob3B0aW9ucy5hc3NldCkge1xuICAgIHJldHVybiBBc3NldEV4cG9ydGVyLmNhbGwob3B0aW9ucy5hc3NldCwgb3B0aW9ucylcbiAgfVxuXG59XG5cbmZ1bmN0aW9uIFByb2plY3RFeHBvcnRlcihvcHRpb25zID0ge30pe1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdFxuXG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhwcm9qZWN0LmNvbnRlbnQpXG4gIFxuICBsZXQgb2JqID0gIHt9XG4gIFxuICBrZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICBsZXQgY29sbGVjdGlvbiA9IHByb2plY3QuY29udGVudFtrZXldXG4gICAgXG4gICAgb2JqW2tleV0gPSBjb2xsZWN0aW9uLnJlZHVjZSgobWVtbyxhc3NldCkgPT4ge1xuICAgICAgbWVtb1thc3NldC5wYXRocy5wcm9qZWN0XSA9IEFzc2V0RXhwb3J0ZXIuY2FsbChhc3NldClcbiAgICAgIHJldHVybiBtZW1vXG4gICAgfSwge30pXG4gIH0pXG4gIFxuICByZXR1cm4gb2JqXG59XG5cbmZ1bmN0aW9uIEFzc2V0RXhwb3J0ZXIob3B0aW9ucyA9IHt9KXtcbiAgbGV0IGFzc2V0ID0gb3B0aW9ucy5hc3NldCB8fCB0aGlzXG5cbiAgcmV0dXJuIHtcbiAgICBpZDogYXNzZXQuaWQsXG4gICAgdXJpOiBhc3NldC51cmksXG4gICAgZmluZ2VycHJpbnQ6IGFzc2V0LmZpbmdlcnByaW50LFxuICAgIGxvYWRlclN0cmluZzogYXNzZXQubG9hZGVyU3RyaW5nLFxuICAgIHBhdGg6IGFzc2V0LnBhdGhzLnByb2plY3RcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBBc3NldE1hbmlmZXN0XG4iXX0=