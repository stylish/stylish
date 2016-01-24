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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYXNzZXRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLGFBQWEsR0FBYixhQUFhO0FBQXRCLFNBQVMsYUFBYSxHQUFjO01BQWIsT0FBTyx5REFBRyxFQUFFOztBQUN4QyxNQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFBOztBQUV2RCxNQUFJLE9BQU8sQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3JDLFFBQUksRUFBRSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN2RCxXQUFPLEVBQUUsQ0FBQTtHQUNWOztBQUVELE1BQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQixXQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQTtHQUNsRDtDQUVGOztBQUVELFNBQVMsZUFBZSxHQUFjO01BQWIsT0FBTyx5REFBRyxFQUFFOztBQUNuQyxNQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFBOztBQUU3QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFekMsTUFBSSxHQUFHLEdBQUksRUFBRSxDQUFBOztBQUViLE1BQUksQ0FBQyxPQUFPLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDbEIsUUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTs7QUFFckMsT0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUMsS0FBSyxFQUFLO0FBQzNDLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDckQsYUFBTyxJQUFJLENBQUE7S0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFBO0dBQ1AsQ0FBQyxDQUFBOztBQUVGLFNBQU8sR0FBRyxDQUFBO0NBQ1g7O0FBRUQsU0FBUyxhQUFhLEdBQWM7TUFBYixPQUFPLHlEQUFHLEVBQUU7O0FBQ2pDLE1BQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFBOztBQUVqQyxTQUFPO0FBQ0wsTUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ1osT0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO0FBQ2QsZUFBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO0FBQzlCLGdCQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7QUFDaEMsUUFBSSxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTztHQUMxQixDQUFBO0NBQ0Y7O2tCQUVjLGFBQWEiLCJmaWxlIjoiYXNzZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIEFzc2V0TWFuaWZlc3Qob3B0aW9ucyA9IHt9KXtcbiAgbGV0IHByb2plY3QgPSBvcHRpb25zLnByb2plY3QgPSBvcHRpb25zLnByb2plY3QgfHwgdGhpc1xuXG4gIGlmIChvcHRpb25zLnByb2plY3QgJiYgIW9wdGlvbnMuYXNzZXQpIHsgIFxuICAgIGxldCByZSA9IFByb2plY3RFeHBvcnRlci5jYWxsKG9wdGlvbnMucHJvamVjdCwgb3B0aW9ucylcbiAgICByZXR1cm4gcmVcbiAgfVxuXG4gIGlmIChvcHRpb25zLmFzc2V0KSB7XG4gICAgcmV0dXJuIEFzc2V0RXhwb3J0ZXIuY2FsbChvcHRpb25zLmFzc2V0LCBvcHRpb25zKVxuICB9XG5cbn1cblxuZnVuY3Rpb24gUHJvamVjdEV4cG9ydGVyKG9wdGlvbnMgPSB7fSl7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0XG5cbiAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHByb2plY3QuY29udGVudClcbiAgXG4gIGxldCBvYmogPSAge31cbiAgXG4gIGtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGxldCBjb2xsZWN0aW9uID0gcHJvamVjdC5jb250ZW50W2tleV1cbiAgICBcbiAgICBvYmpba2V5XSA9IGNvbGxlY3Rpb24ucmVkdWNlKChtZW1vLGFzc2V0KSA9PiB7XG4gICAgICBtZW1vW2Fzc2V0LnBhdGhzLnByb2plY3RdID0gQXNzZXRFeHBvcnRlci5jYWxsKGFzc2V0KVxuICAgICAgcmV0dXJuIG1lbW9cbiAgICB9LCB7fSlcbiAgfSlcbiAgXG4gIHJldHVybiBvYmpcbn1cblxuZnVuY3Rpb24gQXNzZXRFeHBvcnRlcihvcHRpb25zID0ge30pe1xuICBsZXQgYXNzZXQgPSBvcHRpb25zLmFzc2V0IHx8IHRoaXNcblxuICByZXR1cm4ge1xuICAgIGlkOiBhc3NldC5pZCxcbiAgICB1cmk6IGFzc2V0LnVyaSxcbiAgICBmaW5nZXJwcmludDogYXNzZXQuZmluZ2VycHJpbnQsXG4gICAgbG9hZGVyU3RyaW5nOiBhc3NldC5sb2FkZXJTdHJpbmcsXG4gICAgcGF0aDogYXNzZXQucGF0aHMucHJvamVjdFxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFzc2V0TWFuaWZlc3RcbiJdfQ==