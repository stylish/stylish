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

  // temp disable
  var requirePath = asset.fingerprint && false ? asset.paths.project.replace(/\.\w+$/, '-' + asset.fingerprint.substr(0, 6) + '.js') : asset.paths.project.replace(/\.\w+$/, '.js');

  var outPath = project.path('build', 'bundle', requirePath);

  /*if (exists(outPath)) {
    return { requirePath }
  }*/

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

  var lines = ['var bundle = module.exports = {};', 'bundle.project = require(\'./project-export.json\');', 'bundle.entities = require(\'./entities-export.json\');', 'bundle.assets = require(\'./assets-export.json\');', 'bundle.models = require(\'./models-export.json\');', '\n    bundle.requireContexts = {\n      scripts: require.context(\'' + project.scripts.paths.absolute + '\', true, /.js$/i),\n      stylesheets: require.context(\'' + project.stylesheets.paths.absolute + '\', true, /..*ss$/i)\n    };\n    bundle.content = {}'];

  keys(project.content).forEach(function (key) {
    lines.push('var _' + key + ' = bundle.content.' + key + ' = {};');

    project.content[key].forEach(function (asset) {
      var _AssetExporter$call = AssetExporter.call(project, { asset: asset, options: options, key: key });

      var requirePath = _AssetExporter$call.requirePath;

      lines.push('_' + key + '[\'' + asset.id + '\'] = require(\'./' + requirePath + '\');');
    });
  });

  lines.push('module.exports = require(\'' + require.resolve('../bundle') + '\').create(bundle)');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLGFBQWEsR0FBYixhQUFhO1FBWWIsYUFBYSxHQUFiLGFBQWE7UUFrRGIsZUFBZSxHQUFmLGVBQWU7QUE5RHhCLFNBQVMsYUFBYSxHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDekMsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRXBDLE1BQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZDLFdBQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDL0M7O0FBRUQsTUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLFdBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDakQ7Q0FDRjs7QUFFTSxTQUFTLGFBQWEsR0FBMEI7TUFBeEIsT0FBTyx5REFBRyxFQUFFO01BQUUsUUFBUTs7QUFDbkQsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBO01BQ1osS0FBSyxHQUFLLE9BQU8sQ0FBakIsS0FBSzs7QUFFWCxNQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNkLFNBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDeEM7OztBQUFBLEFBR0QsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxLQUFLLEdBQ3hDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLFFBQU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxTQUFPLEdBQzlFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVB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QUVjLGFBQWE7O0FBRTVCLFNBQVMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFO0FBQzlDLE9BQUssQ0FDSCxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQU0sUUFBUSxrQkFBZ0IsRUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FDeEQsQ0FBQTtDQUNGOztBQUVELFNBQVMsS0FBSyxHQUFVOzs7QUFDckIsU0FBTyxZQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLE1BQUEscUJBQVMsQ0FBQTtDQUN4Qzs7QUFFRCxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzdCLE9BQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDcEMsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBOztBQUVuRCxTQUFPLFFBQVEsQ0FBQTtDQUNoQjs7QUFFRCxTQUFTLE1BQU0sR0FBVTs7O0FBQ3RCLFNBQU8sYUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxNQUFBLHNCQUFTLENBQUE7Q0FDMUM7O0FBRUQsU0FBUyx1QkFBdUIsQ0FBRSxPQUFPLEVBQUUsRUFFMUM7O2NBRWdCLE1BQU07SUFBZixJQUFJLFdBQUosSUFBSSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gQnJvd3NlckJ1bmRsZSAob3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0ID0gdGhpc1xuXG4gIGlmIChvcHRpb25zLmFzc2V0ICYmIG9wdGlvbnMuY29sbGVjdGlvbikge1xuICAgIHJldHVybiBBc3NldEV4cG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2plY3QpIHtcbiAgICByZXR1cm4gUHJvamVjdEV4cG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQXNzZXRFeHBvcnRlciAob3B0aW9ucyA9IHt9LCBjYWxsYmFjaykge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IHsgYXNzZXQgfSA9IG9wdGlvbnNcblxuICBpZiAoIWFzc2V0LnJhdykge1xuICAgIGFzc2V0LnJ1bkltcG9ydGVyKCdkaXNrJywge3N5bmM6IHRydWV9KVxuICB9XG5cbiAgLy8gdGVtcCBkaXNhYmxlXG4gIGxldCByZXF1aXJlUGF0aCA9IGFzc2V0LmZpbmdlcnByaW50ICYmIGZhbHNlXG4gICAgPyBhc3NldC5wYXRocy5wcm9qZWN0LnJlcGxhY2UoL1xcLlxcdyskLyxgLSR7IGFzc2V0LmZpbmdlcnByaW50LnN1YnN0cigwLDYpIH0uanNgKVxuICAgIDogYXNzZXQucGF0aHMucHJvamVjdC5yZXBsYWNlKC9cXC5cXHcrJC8sJy5qcycpXG5cbiAgbGV0IG91dFBhdGggPSBwcm9qZWN0LnBhdGgoJ2J1aWxkJywnYnVuZGxlJywgcmVxdWlyZVBhdGgpXG5cbiAgLyppZiAoZXhpc3RzKG91dFBhdGgpKSB7XG4gICAgcmV0dXJuIHsgcmVxdWlyZVBhdGggfVxuICB9Ki9cblxuICBsZXQgb3V0cHV0ID0ge1xuICAgIGlkOiBhc3NldC5pZCxcbiAgICBwYXRoczogYXNzZXQucGF0aHMsXG4gICAgYXNzZXRHcm91cDogYXNzZXQuYXNzZXRHcm91cCxcbiAgICBmaW5nZXJwcmludDogYXNzZXQuZmluZ2VycHJpbnRcbiAgfVxuXG4gIGlmIChhc3NldC5hc3NldEdyb3VwID09PSAnZGF0YV9zb3VyY2VzJykge1xuICAgIG91dHB1dCA9IE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7XG4gICAgICBkYXRhOiBhc3NldC5kYXRhXG4gICAgfSlcbiAgfVxuXG4gIGlmIChhc3NldC5hc3NldEdyb3VwID09PSAnZG9jdW1lbnRzJykge1xuICAgIG91dHB1dCA9IE9iamVjdC5hc3NpZ24ob3V0cHV0LCB7XG4gICAgICBtYXJrZG93bjogYXNzZXQucmF3LFxuICAgICAgYXN0OiBhc3NldC5pbmRleGVkLFxuICAgICAgaW5kZXhlczogYXNzZXQuaW5kZXhlcyxcbiAgICAgIGh0bWw6IGFzc2V0Lmh0bWwuY29udGVudFxuICAgIH0pXG4gIH1cblxuICB3cml0ZShvdXRQYXRoLCBgbW9kdWxlLmV4cG9ydHMgPSAkeyBKU09OLnN0cmluZ2lmeShvdXRwdXQpIH07YClcblxuICByZXR1cm4ge1xuICAgIHJlcXVpcmVQYXRoXG4gIH1cbn1cblxuY29uc3QgSW5jbHVkZUV4cG9ydGVycyA9IFsnYXNzZXRzJywgJ2VudGl0aWVzJywgJ3Byb2plY3QnLCAnbW9kZWxzJyBdXG5cbmV4cG9ydCBmdW5jdGlvbiBQcm9qZWN0RXhwb3J0ZXIgKG9wdGlvbnMgPSB7fSwgY2FsbGJhY2spIHtcbiAgbGV0IHByb2plY3QgPSBvcHRpb25zLnByb2plY3RcblxuXG4gIGlmIChvcHRpb25zLnJ1bkluY2x1ZGVkICE9PSBmYWxzZSkge1xuICAgIEluY2x1ZGVFeHBvcnRlcnMuZm9yRWFjaChleHBvcnRlciA9PlxuICAgICAgcnVuQW5kU2F2ZShwcm9qZWN0LCBleHBvcnRlciwgb3B0aW9ucylcbiAgICApXG4gIH1cblxuICBsZXQgbGluZXMgPSBbXG4gICAgYHZhciBidW5kbGUgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O2AsXG4gICAgYGJ1bmRsZS5wcm9qZWN0ID0gcmVxdWlyZSgnLi9wcm9qZWN0LWV4cG9ydC5qc29uJyk7YCxcbiAgICBgYnVuZGxlLmVudGl0aWVzID0gcmVxdWlyZSgnLi9lbnRpdGllcy1leHBvcnQuanNvbicpO2AsXG4gICAgYGJ1bmRsZS5hc3NldHMgPSByZXF1aXJlKCcuL2Fzc2V0cy1leHBvcnQuanNvbicpO2AsXG4gICAgYGJ1bmRsZS5tb2RlbHMgPSByZXF1aXJlKCcuL21vZGVscy1leHBvcnQuanNvbicpO2AsXG4gICAgYFxuICAgIGJ1bmRsZS5yZXF1aXJlQ29udGV4dHMgPSB7XG4gICAgICBzY3JpcHRzOiByZXF1aXJlLmNvbnRleHQoJyR7IHByb2plY3Quc2NyaXB0cy5wYXRocy5hYnNvbHV0ZSB9JywgdHJ1ZSwgL1xcLmpzJC9pKSxcbiAgICAgIHN0eWxlc2hlZXRzOiByZXF1aXJlLmNvbnRleHQoJyR7IHByb2plY3Quc3R5bGVzaGVldHMucGF0aHMuYWJzb2x1dGUgfScsIHRydWUsIC9cXC4uKnNzJC9pKVxuICAgIH07XG4gICAgYnVuZGxlLmNvbnRlbnQgPSB7fWBcbiAgXVxuXG4gIGtleXMocHJvamVjdC5jb250ZW50KS5mb3JFYWNoKGtleSA9PiB7XG4gICAgbGluZXMucHVzaChgdmFyIF8keyBrZXkgfSA9IGJ1bmRsZS5jb250ZW50LiR7IGtleSB9ID0ge307YClcblxuICAgIHByb2plY3QuY29udGVudFtrZXldLmZvckVhY2goYXNzZXQgPT4ge1xuICAgICAgbGV0IHsgcmVxdWlyZVBhdGggfSA9IEFzc2V0RXhwb3J0ZXIuY2FsbChwcm9qZWN0LCB7IGFzc2V0LCBvcHRpb25zLCBrZXkgfSlcbiAgICAgIGxpbmVzLnB1c2goYF8keyBrZXkgfVsnJHsgYXNzZXQuaWQgfSddID0gcmVxdWlyZSgnLi8ke3JlcXVpcmVQYXRofScpO2ApXG4gICAgfSlcbiAgfSlcblxuICBsaW5lcy5wdXNoKGBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJyR7IHJlcXVpcmUucmVzb2x2ZSgnLi4vYnVuZGxlJykgfScpLmNyZWF0ZShidW5kbGUpYClcblxuICByZXR1cm4gd3JpdGUoXG4gICAgcHJvamVjdC5wYXRoKCdidWlsZCcsJ2J1bmRsZScsJ2luZGV4LmpzJyksIGxpbmVzLmpvaW4oXCJcXG5cIilcbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyQnVuZGxlXG5cbmZ1bmN0aW9uIHJ1bkFuZFNhdmUocHJvamVjdCwgZXhwb3J0ZXIsIG9wdGlvbnMpIHtcbiAgd3JpdGUgKFxuICAgIHByb2plY3QucGF0aCgnYnVpbGQnLCAnYnVuZGxlJywgYCR7IGV4cG9ydGVyIH0tZXhwb3J0Lmpzb25gKSxcbiAgICBKU09OLnN0cmluZ2lmeShwcm9qZWN0LnJ1bi5leHBvcnRlcihleHBvcnRlciwgb3B0aW9ucykpXG4gIClcbn1cblxuZnVuY3Rpb24gbWtkaXIoLi4uYXJncykge1xuICAgcmV0dXJuIHJlcXVpcmUoJ21rZGlycCcpLnN5bmMoLi4uYXJncylcbn1cblxuZnVuY3Rpb24gd3JpdGUocGF0aCwgY29udGVudHMpIHtcbiAgbWtkaXIocmVxdWlyZSgncGF0aCcpLmRpcm5hbWUocGF0aCkpXG4gIHJlcXVpcmUoJ2ZzJykud3JpdGVGaWxlU3luYyhwYXRoLCBjb250ZW50cywgJ3V0ZjgnKVxuXG4gIHJldHVybiBjb250ZW50c1xufVxuXG5mdW5jdGlvbiBleGlzdHMoLi4uYXJncykge1xuICAgcmV0dXJuIHJlcXVpcmUoJ2ZzJykuZXhpc3RzU3luYyguLi5hcmdzKVxufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZVJlcXVpcmVDb250ZXh0cyAocHJvamVjdCkge1xuXG59XG5cbmNvbnN0IHsga2V5cyB9ID0gT2JqZWN0XG4iXX0=