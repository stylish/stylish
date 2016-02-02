'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserBundle = BrowserBundle;
exports.AssetExporter = AssetExporter;
exports.ProjectExporter = ProjectExporter;
function BrowserBundle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project = this;

  if (options.asset && options.collection) {
    return AssetExporter.apply(project, arguments);
  }

  if (options.project) {
    return ProjectExporter.apply(project, arguments);
  }
}

function AssetExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var project = this;
  var asset = options.asset;

  if (!asset.raw) {
    asset.runImporter('disk', { sync: true });
  }

  var requirePath = asset.fingerprint ? asset.paths.project.replace(/\.\w+$/, '-' + asset.fingerprint.substr(0, 6) + '.js') : asset.paths.project.replace(/\.\w+$/, '.js');

  var outPath = project.path('build', 'bundle', requirePath);

  if (exists(outPath)) {
    return { requirePath: requirePath };
  }

  var output = {
    id: asset.id,
    paths: asset.paths,
    assetGroup: asset.assetGroup,
    fingerprint: asset.fingerprint
  };

  if (asset.assetGroup === 'data_sources') {
    output = Object.assign(output, {
      data: asset.data
    });
  }

  if (asset.assetGroup === 'documents') {
    output = Object.assign(output, {
      markdown: asset.raw,
      ast: asset.indexed,
      indexes: asset.indexes,
      html: asset.html.content
    });
  }

  write(outPath, 'module.exports = ' + JSON.stringify(output) + ';');

  return {
    requirePath: requirePath
  };
}

var IncludeExporters = ['assets', 'entities', 'project', 'models'];

function ProjectExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var project = options.project;

  if (options.runIncluded !== false) {
    IncludeExporters.forEach(function (exporter) {
      return runAndSave(project, exporter, options);
    });
  }

  var lines = ['exports = module.exports = require(\'./project-export.json\');', 'exports.entities = require(\'./entities-export.json\');', 'exports.assets = require(\'./assets-export.json\');', 'exports.models = require(\'./models-export.json\');', '\n    exports.requireContexts = {\n      scripts: require.context(\'' + project.scripts.paths.absolute + '\', true, /.js$/i),\n      stylesheets: require.context(\'' + project.stylesheets.paths.absolute + '\', true, /..*ss$/i)\n    }\n    ', 'exports.content = {}'];

  keys(project.content).forEach(function (key) {
    lines.push('var _' + key + ' = exports.content.' + key + ' = {};');

    project.content[key].forEach(function (asset) {
      var _AssetExporter$call = AssetExporter.call(project, { asset: asset, options: options, key: key });

      var requirePath = _AssetExporter$call.requirePath;

      lines.push('_' + key + '[\'' + asset.id + '\'] = require(\'./' + requirePath + '\');');
    });
  });

  return write(project.path('build', 'bundle', 'index.js'), lines.join("\n"));
}

exports.default = BrowserBundle;

function runAndSave(project, exporter, options) {
  write(project.path('build', 'bundle', exporter + '-export.json'), JSON.stringify(project.run.exporter(exporter, options)));
}

function mkdir() {
  var _require;

  return (_require = require('mkdirp')).sync.apply(_require, arguments);
}

function write(path, contents) {
  mkdir(require('path').dirname(path));
  require('fs').writeFileSync(path, contents, 'utf8');

  return contents;
}

function exists() {
  var _require2;

  return (_require2 = require('fs')).existsSync.apply(_require2, arguments);
}

function generateRequireContexts(project) {}

var _Object = Object;
var keys = _Object.keys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLGFBQWEsR0FBYixhQUFhO1FBWWIsYUFBYSxHQUFiLGFBQWE7UUFpRGIsZUFBZSxHQUFmLGVBQWU7QUE3RHhCLFNBQVMsYUFBYSxHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDekMsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRXBDLE1BQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZDLFdBQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDL0M7O0FBRUQsTUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLFdBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDakQ7Q0FDRjs7QUFFTSxTQUFTLGFBQWEsR0FBMEI7TUFBeEIsT0FBTyx5REFBRyxFQUFFO01BQUUsUUFBUTs7QUFDbkQsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBO01BQ1osS0FBSyxHQUFLLE9BQU8sQ0FBakIsS0FBSzs7QUFFWCxNQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNkLFNBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDeEM7O0FBRUQsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FDL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsUUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQU8sR0FDOUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxLQUFLLENBQUMsQ0FB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OztBQUU1QixTQUFTLFVBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRTtBQUM5QyxPQUFLLENBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFNLFFBQVEsa0JBQWdCLEVBQzVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQ3hELENBQUE7Q0FDRjs7QUFFRCxTQUFTLEtBQUssR0FBVTs7O0FBQ3JCLFNBQU8sWUFBQSxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUMsSUFBSSxNQUFBLHFCQUFTLENBQUE7Q0FDeEM7O0FBRUQsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM3QixPQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQ3BDLFNBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTs7QUFFbkQsU0FBTyxRQUFRLENBQUE7Q0FDaEI7O0FBRUQsU0FBUyxNQUFNLEdBQVU7OztBQUN0QixTQUFPLGFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFDLFVBQVUsTUFBQSxzQkFBUyxDQUFBO0NBQzFDOztBQUVELFNBQVMsdUJBQXVCLENBQUUsT0FBTyxFQUFFLEVBRTFDOztjQUVnQixNQUFNO0lBQWYsSUFBSSxXQUFKLElBQUkiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIEJyb3dzZXJCdW5kbGUgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCA9IHRoaXNcblxuICBpZiAob3B0aW9ucy5hc3NldCAmJiBvcHRpb25zLmNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gQXNzZXRFeHBvcnRlci5hcHBseShwcm9qZWN0LCBhcmd1bWVudHMpXG4gIH1cblxuICBpZiAob3B0aW9ucy5wcm9qZWN0KSB7XG4gICAgcmV0dXJuIFByb2plY3RFeHBvcnRlci5hcHBseShwcm9qZWN0LCBhcmd1bWVudHMpXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFzc2V0RXhwb3J0ZXIgKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCB7IGFzc2V0IH0gPSBvcHRpb25zXG5cbiAgaWYgKCFhc3NldC5yYXcpIHtcbiAgICBhc3NldC5ydW5JbXBvcnRlcignZGlzaycsIHtzeW5jOiB0cnVlfSlcbiAgfVxuXG4gIGxldCByZXF1aXJlUGF0aCA9IGFzc2V0LmZpbmdlcnByaW50XG4gICAgPyBhc3NldC5wYXRocy5wcm9qZWN0LnJlcGxhY2UoL1xcLlxcdyskLyxgLSR7IGFzc2V0LmZpbmdlcnByaW50LnN1YnN0cigwLDYpIH0uanNgKVxuICAgIDogYXNzZXQucGF0aHMucHJvamVjdC5yZXBsYWNlKC9cXC5cXHcrJC8sJy5qcycpXG5cbiAgbGV0IG91dFBhdGggPSBwcm9qZWN0LnBhdGgoJ2J1aWxkJywnYnVuZGxlJywgcmVxdWlyZVBhdGgpXG5cbiAgaWYgKGV4aXN0cyhvdXRQYXRoKSkge1xuICAgIHJldHVybiB7IHJlcXVpcmVQYXRoIH1cbiAgfVxuXG4gIGxldCBvdXRwdXQgPSB7XG4gICAgaWQ6IGFzc2V0LmlkLFxuICAgIHBhdGhzOiBhc3NldC5wYXRocyxcbiAgICBhc3NldEdyb3VwOiBhc3NldC5hc3NldEdyb3VwLFxuICAgIGZpbmdlcnByaW50OiBhc3NldC5maW5nZXJwcmludFxuICB9XG5cbiAgaWYgKGFzc2V0LmFzc2V0R3JvdXAgPT09ICdkYXRhX3NvdXJjZXMnKSB7XG4gICAgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtcbiAgICAgIGRhdGE6IGFzc2V0LmRhdGFcbiAgICB9KVxuICB9XG5cbiAgaWYgKGFzc2V0LmFzc2V0R3JvdXAgPT09ICdkb2N1bWVudHMnKSB7XG4gICAgb3V0cHV0ID0gT2JqZWN0LmFzc2lnbihvdXRwdXQsIHtcbiAgICAgIG1hcmtkb3duOiBhc3NldC5yYXcsXG4gICAgICBhc3Q6IGFzc2V0LmluZGV4ZWQsXG4gICAgICBpbmRleGVzOiBhc3NldC5pbmRleGVzLFxuICAgICAgaHRtbDogYXNzZXQuaHRtbC5jb250ZW50XG4gICAgfSlcbiAgfVxuXG4gIHdyaXRlKG91dFBhdGgsIGBtb2R1bGUuZXhwb3J0cyA9ICR7IEpTT04uc3RyaW5naWZ5KG91dHB1dCkgfTtgKVxuXG4gIHJldHVybiB7XG4gICAgcmVxdWlyZVBhdGhcbiAgfVxufVxuXG5jb25zdCBJbmNsdWRlRXhwb3J0ZXJzID0gWydhc3NldHMnLCAnZW50aXRpZXMnLCAncHJvamVjdCcsICdtb2RlbHMnIF1cblxuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3RFeHBvcnRlciAob3B0aW9ucyA9IHt9LCBjYWxsYmFjaykge1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdFxuXG5cbiAgaWYgKG9wdGlvbnMucnVuSW5jbHVkZWQgIT09IGZhbHNlKSB7XG4gICAgSW5jbHVkZUV4cG9ydGVycy5mb3JFYWNoKGV4cG9ydGVyID0+XG4gICAgICBydW5BbmRTYXZlKHByb2plY3QsIGV4cG9ydGVyLCBvcHRpb25zKVxuICAgIClcbiAgfVxuXG4gIGxldCBsaW5lcyA9IFtcbiAgICBgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9wcm9qZWN0LWV4cG9ydC5qc29uJyk7YCxcbiAgICBgZXhwb3J0cy5lbnRpdGllcyA9IHJlcXVpcmUoJy4vZW50aXRpZXMtZXhwb3J0Lmpzb24nKTtgLFxuICAgIGBleHBvcnRzLmFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzLWV4cG9ydC5qc29uJyk7YCxcbiAgICBgZXhwb3J0cy5tb2RlbHMgPSByZXF1aXJlKCcuL21vZGVscy1leHBvcnQuanNvbicpO2AsXG4gICAgYFxuICAgIGV4cG9ydHMucmVxdWlyZUNvbnRleHRzID0ge1xuICAgICAgc2NyaXB0czogcmVxdWlyZS5jb250ZXh0KCckeyBwcm9qZWN0LnNjcmlwdHMucGF0aHMuYWJzb2x1dGUgfScsIHRydWUsIC9cXC5qcyQvaSksXG4gICAgICBzdHlsZXNoZWV0czogcmVxdWlyZS5jb250ZXh0KCckeyBwcm9qZWN0LnN0eWxlc2hlZXRzLnBhdGhzLmFic29sdXRlIH0nLCB0cnVlLCAvXFwuLipzcyQvaSlcbiAgICB9XG4gICAgYCxcbiAgICBgZXhwb3J0cy5jb250ZW50ID0ge31gXG4gIF1cblxuICBrZXlzKHByb2plY3QuY29udGVudCkuZm9yRWFjaChrZXkgPT4ge1xuICAgIGxpbmVzLnB1c2goYHZhciBfJHsga2V5IH0gPSBleHBvcnRzLmNvbnRlbnQuJHsga2V5IH0gPSB7fTtgKVxuXG4gICAgcHJvamVjdC5jb250ZW50W2tleV0uZm9yRWFjaChhc3NldCA9PiB7XG4gICAgICBsZXQgeyByZXF1aXJlUGF0aCB9ID0gQXNzZXRFeHBvcnRlci5jYWxsKHByb2plY3QsIHsgYXNzZXQsIG9wdGlvbnMsIGtleSB9KVxuICAgICAgbGluZXMucHVzaChgXyR7IGtleSB9WyckeyBhc3NldC5pZCB9J10gPSByZXF1aXJlKCcuLyR7cmVxdWlyZVBhdGh9Jyk7YClcbiAgICB9KVxuICB9KVxuXG4gIHJldHVybiB3cml0ZShcbiAgICBwcm9qZWN0LnBhdGgoJ2J1aWxkJywnYnVuZGxlJywnaW5kZXguanMnKSwgbGluZXMuam9pbihcIlxcblwiKVxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJCdW5kbGVcblxuZnVuY3Rpb24gcnVuQW5kU2F2ZShwcm9qZWN0LCBleHBvcnRlciwgb3B0aW9ucykge1xuICB3cml0ZSAoXG4gICAgcHJvamVjdC5wYXRoKCdidWlsZCcsICdidW5kbGUnLCBgJHsgZXhwb3J0ZXIgfS1leHBvcnQuanNvbmApLFxuICAgIEpTT04uc3RyaW5naWZ5KHByb2plY3QucnVuLmV4cG9ydGVyKGV4cG9ydGVyLCBvcHRpb25zKSlcbiAgKVxufVxuXG5mdW5jdGlvbiBta2RpciguLi5hcmdzKSB7XG4gICByZXR1cm4gcmVxdWlyZSgnbWtkaXJwJykuc3luYyguLi5hcmdzKVxufVxuXG5mdW5jdGlvbiB3cml0ZShwYXRoLCBjb250ZW50cykge1xuICBta2RpcihyZXF1aXJlKCdwYXRoJykuZGlybmFtZShwYXRoKSlcbiAgcmVxdWlyZSgnZnMnKS53cml0ZUZpbGVTeW5jKHBhdGgsIGNvbnRlbnRzLCAndXRmOCcpXG5cbiAgcmV0dXJuIGNvbnRlbnRzXG59XG5cbmZ1bmN0aW9uIGV4aXN0cyguLi5hcmdzKSB7XG4gICByZXR1cm4gcmVxdWlyZSgnZnMnKS5leGlzdHNTeW5jKC4uLmFyZ3MpXG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmVxdWlyZUNvbnRleHRzIChwcm9qZWN0KSB7XG5cbn1cblxuY29uc3QgeyBrZXlzIH0gPSBPYmplY3RcbiJdfQ==