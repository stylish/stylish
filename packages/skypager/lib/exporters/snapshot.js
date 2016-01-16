'use strict';

module.exports = function run_snapshot_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;
  var entities = project.entities;

  var snapshot = {
    entities: entities,
    project: {
      paths: project.paths,
      manifest: project.manifest,
      root: project.root,
      cacheKey: project.cacheKey
    },
    assets: project.run.exporter('asset_manifest'),
    content: project.run.exporter('collection_bundle')
  };

  snapshot.html = project.documents.all.reduce(function (memo, doc) {
    try {
      memo[doc.id] = doc.html.content;
    } catch (error) {
      console.log('HTML Rendering Error', error.message);
    }
    return memo;
  }, {});

  return snapshot;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvc25hcHNob3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMscUJBQXFCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUMzRCxNQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztBQUN0QyxNQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBOztBQUUvQixNQUFJLFFBQVEsR0FBRztBQUNiLFlBQVEsRUFBUixRQUFRO0FBQ1IsV0FBTyxFQUFFO0FBQ1AsV0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO0FBQ3BCLGNBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtBQUMxQixVQUFJLEVBQUUsT0FBTyxDQUFDLElBQUk7QUFDbEIsY0FBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO0tBQzNCO0FBQ0QsVUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDO0FBQzlDLFdBQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQztHQUNuRCxDQUFBOztBQUVELFVBQVEsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBSztBQUMxRCxRQUFJO0FBQ0YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQTtLQUNoQyxDQUFDLE9BQU8sS0FBSyxFQUFFO0FBQ2QsYUFBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDbkQ7QUFDRCxXQUFPLElBQUksQ0FBQTtHQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7O0FBRU4sU0FBTyxRQUFRLENBQUE7Q0FDaEIsQ0FBQSIsImZpbGUiOiJzbmFwc2hvdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gcnVuX3NuYXBzaG90X2V4cG9ydGVyIChvcHRpb25zID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSBvcHRpb25zLnByb2plY3QgfHwgdGhpcztcbiAgbGV0IGVudGl0aWVzID0gcHJvamVjdC5lbnRpdGllc1xuXG4gIGxldCBzbmFwc2hvdCA9IHtcbiAgICBlbnRpdGllcyxcbiAgICBwcm9qZWN0OiB7XG4gICAgICBwYXRoczogcHJvamVjdC5wYXRocyxcbiAgICAgIG1hbmlmZXN0OiBwcm9qZWN0Lm1hbmlmZXN0LFxuICAgICAgcm9vdDogcHJvamVjdC5yb290LFxuICAgICAgY2FjaGVLZXk6IHByb2plY3QuY2FjaGVLZXlcbiAgICB9LFxuICAgIGFzc2V0czogcHJvamVjdC5ydW4uZXhwb3J0ZXIoJ2Fzc2V0X21hbmlmZXN0JyksXG4gICAgY29udGVudDogcHJvamVjdC5ydW4uZXhwb3J0ZXIoJ2NvbGxlY3Rpb25fYnVuZGxlJylcbiAgfVxuXG4gIHNuYXBzaG90Lmh0bWwgPSBwcm9qZWN0LmRvY3VtZW50cy5hbGwucmVkdWNlKChtZW1vLCBkb2MpID0+IHtcbiAgICB0cnkge1xuICAgICAgbWVtb1tkb2MuaWRdID0gZG9jLmh0bWwuY29udGVudFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnSFRNTCBSZW5kZXJpbmcgRXJyb3InLCBlcnJvci5tZXNzYWdlKVxuICAgIH1cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcblxuICByZXR1cm4gc25hcHNob3Rcbn1cbiJdfQ==