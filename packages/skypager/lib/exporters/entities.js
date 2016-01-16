'use strict';

module.exports = function run_entities_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;
  var entities = project.entities || {};

  var format = options.format;
  var filename = options.filename;

  if (options.output) {
    project.exporters.run('disk', {
      type: 'entities',
      format: format,
      filename: filename,
      project: project,
      payload: {
        entities: entities
      }
    });
  }

  return entities;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvZW50aXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMscUJBQXFCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUMzRCxNQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUN0QyxNQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTs7TUFFL0IsTUFBTSxHQUFlLE9BQU8sQ0FBNUIsTUFBTTtNQUFFLFFBQVEsR0FBSyxPQUFPLENBQXBCLFFBQVE7O0FBRXRCLE1BQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixXQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7QUFDNUIsVUFBSSxFQUFFLFVBQVU7QUFDaEIsWUFBTSxFQUFOLE1BQU07QUFDTixjQUFRLEVBQVIsUUFBUTtBQUNSLGFBQU8sRUFBUCxPQUFPO0FBQ1AsYUFBTyxFQUFFO0FBQ1AsZ0JBQVEsRUFBUixRQUFRO09BQ1Q7S0FDRixDQUFDLENBQUE7R0FDSDs7QUFFRCxTQUFPLFFBQVEsQ0FBQTtDQUNoQixDQUFBIiwiZmlsZSI6ImVudGl0aWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBydW5fZW50aXRpZXNfZXhwb3J0ZXIgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzO1xuICBsZXQgZW50aXRpZXMgPSBwcm9qZWN0LmVudGl0aWVzIHx8IHt9XG5cbiAgbGV0IHsgZm9ybWF0LCBmaWxlbmFtZSB9ID0gb3B0aW9uc1xuXG4gIGlmIChvcHRpb25zLm91dHB1dCkge1xuICAgIHByb2plY3QuZXhwb3J0ZXJzLnJ1bignZGlzaycsIHtcbiAgICAgIHR5cGU6ICdlbnRpdGllcycsXG4gICAgICBmb3JtYXQsXG4gICAgICBmaWxlbmFtZSxcbiAgICAgIHByb2plY3QsXG4gICAgICBwYXlsb2FkOiB7XG4gICAgICAgIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHJldHVybiBlbnRpdGllc1xufVxuXG4iXX0=