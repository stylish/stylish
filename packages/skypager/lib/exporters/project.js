"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProjectExporter = ProjectExporter;
/**
 * Serialize import project information into a JSON Object.
 *
 * @param {Array} includeData which project datasources to include
 *
 */
function ProjectExporter() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = params.project || this;

  var root = project.root;
  var options = project.options;
  var cacheKey = project.cacheKey;
  var paths = project.paths;

  var data = {};

  if (options.includeData) {
    options.includeData.forEach(function (dataSourceId) {
      var dataSource = project.data_sources.at(dataSourceId);
      data[dataSourceId] = dataSource.data;
    });
  }

  return Object.assign(data, {
    options: options,
    cacheKey: cacheKey,
    paths: paths,
    root: root
  });
}

exports.default = ProjectExporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvcHJvamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQU1nQixlQUFlLEdBQWYsZUFBZTs7Ozs7OztBQUF4QixTQUFTLGVBQWUsR0FBZTtNQUFiLE1BQU0seURBQUcsRUFBRTs7QUFDMUMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUE7O01BRTlCLElBQUksR0FBK0IsT0FBTyxDQUExQyxJQUFJO01BQUUsT0FBTyxHQUFzQixPQUFPLENBQXBDLE9BQU87TUFBRSxRQUFRLEdBQVksT0FBTyxDQUEzQixRQUFRO01BQUUsS0FBSyxHQUFLLE9BQU8sQ0FBakIsS0FBSzs7QUFFdEMsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFBOztBQUVmLE1BQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtBQUN2QixXQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFlBQVksRUFBSTtBQUN6QyxVQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUN0RCxVQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQTtLQUN0QyxDQUFDLENBQUE7R0FDSDs7QUFFRCxTQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ3pCLFdBQU8sRUFBUCxPQUFPO0FBQ1AsWUFBUSxFQUFSLFFBQVE7QUFDUixTQUFLLEVBQUwsS0FBSztBQUNMLFFBQUksRUFBSixJQUFJO0dBQ0wsQ0FBQyxDQUFBO0NBQ0g7O2tCQUVjLGVBQWUiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU2VyaWFsaXplIGltcG9ydCBwcm9qZWN0IGluZm9ybWF0aW9uIGludG8gYSBKU09OIE9iamVjdC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBpbmNsdWRlRGF0YSB3aGljaCBwcm9qZWN0IGRhdGFzb3VyY2VzIHRvIGluY2x1ZGVcbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0RXhwb3J0ZXIgKHBhcmFtcyA9IHt9KSB7XG4gIGNvbnN0IHByb2plY3QgPSBwYXJhbXMucHJvamVjdCB8fCB0aGlzXG5cbiAgY29uc3QgeyByb290LCBvcHRpb25zLCBjYWNoZUtleSwgcGF0aHMgfSA9IHByb2plY3RcblxuICBjb25zdCBkYXRhID0ge31cblxuICBpZiAob3B0aW9ucy5pbmNsdWRlRGF0YSkge1xuICAgIG9wdGlvbnMuaW5jbHVkZURhdGEuZm9yRWFjaChkYXRhU291cmNlSWQgPT4ge1xuICAgICAgIGxldCBkYXRhU291cmNlID0gcHJvamVjdC5kYXRhX3NvdXJjZXMuYXQoZGF0YVNvdXJjZUlkKVxuICAgICAgIGRhdGFbZGF0YVNvdXJjZUlkXSA9IGRhdGFTb3VyY2UuZGF0YVxuICAgIH0pXG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmFzc2lnbihkYXRhLCB7XG4gICAgb3B0aW9ucyxcbiAgICBjYWNoZUtleSxcbiAgICBwYXRocyxcbiAgICByb290XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2plY3RFeHBvcnRlclxuIl19