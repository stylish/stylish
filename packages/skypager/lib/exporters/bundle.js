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

  var lines = ['exports = module.exports = require(\'./project-export.json\');', 'exports.entities = require(\'./entities-export.json\');', 'exports.assets = require(\'./assets-export.json\');', 'exports.models = require(\'./models-export.json\');', 'exports.content = {}'];

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

var _Object = Object;
var keys = _Object.keys;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYnVuZGxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBQWdCLGFBQWEsR0FBYixhQUFhO1FBWWIsYUFBYSxHQUFiLGFBQWE7UUFpRGIsZUFBZSxHQUFmLGVBQWU7QUE3RHhCLFNBQVMsYUFBYSxHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDekMsTUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRXBDLE1BQUksT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsVUFBVSxFQUFFO0FBQ3ZDLFdBQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDL0M7O0FBRUQsTUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLFdBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7R0FDakQ7Q0FDRjs7QUFFTSxTQUFTLGFBQWEsR0FBMEI7TUFBeEIsT0FBTyx5REFBRyxFQUFFO01BQUUsUUFBUTs7QUFDbkQsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBO01BQ1osS0FBSyxHQUFLLE9BQU8sQ0FBakIsS0FBSzs7QUFFWCxNQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUNkLFNBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7R0FDeEM7O0FBRUQsTUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsR0FDL0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsUUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQU8sR0FDOUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxLQUFLLENBQUMsQ0FB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QUFDLE9BQU8sRUFBRSxRQUFRLEVBQU0sUUFBUSxrQkFBZ0IsRUFDNUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FDeEQsQ0FBQTtDQUNGOztBQUVELFNBQVMsS0FBSyxHQUFVOzs7QUFDckIsU0FBTyxZQUFBLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQyxJQUFJLE1BQUEscUJBQVMsQ0FBQTtDQUN4Qzs7QUFFRCxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzdCLE9BQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDcEMsU0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFBOztBQUVuRCxTQUFPLFFBQVEsQ0FBQTtDQUNoQjs7QUFFRCxTQUFTLE1BQU0sR0FBVTs7O0FBQ3RCLFNBQU8sYUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsVUFBVSxNQUFBLHNCQUFTLENBQUE7Q0FDMUM7O2NBRWdCLE1BQU07SUFBZixJQUFJLFdBQUosSUFBSSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gQnJvd3NlckJ1bmRsZSAob3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0ID0gdGhpc1xuXG4gIGlmIChvcHRpb25zLmFzc2V0ICYmIG9wdGlvbnMuY29sbGVjdGlvbikge1xuICAgIHJldHVybiBBc3NldEV4cG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxuXG4gIGlmIChvcHRpb25zLnByb2plY3QpIHtcbiAgICByZXR1cm4gUHJvamVjdEV4cG9ydGVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gQXNzZXRFeHBvcnRlciAob3B0aW9ucyA9IHt9LCBjYWxsYmFjaykge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IHsgYXNzZXQgfSA9IG9wdGlvbnNcblxuICBpZiAoIWFzc2V0LnJhdykge1xuICAgIGFzc2V0LnJ1bkltcG9ydGVyKCdkaXNrJywge3N5bmM6IHRydWV9KVxuICB9XG5cbiAgbGV0IHJlcXVpcmVQYXRoID0gYXNzZXQuZmluZ2VycHJpbnRcbiAgICA/IGFzc2V0LnBhdGhzLnByb2plY3QucmVwbGFjZSgvXFwuXFx3KyQvLGAtJHsgYXNzZXQuZmluZ2VycHJpbnQuc3Vic3RyKDAsNikgfS5qc2ApXG4gICAgOiBhc3NldC5wYXRocy5wcm9qZWN0LnJlcGxhY2UoL1xcLlxcdyskLywnLmpzJylcblxuICBsZXQgb3V0UGF0aCA9IHByb2plY3QucGF0aCgnYnVpbGQnLCdidW5kbGUnLCByZXF1aXJlUGF0aClcblxuICBpZiAoZXhpc3RzKG91dFBhdGgpKSB7XG4gICAgcmV0dXJuIHsgcmVxdWlyZVBhdGggfVxuICB9XG5cbiAgbGV0IG91dHB1dCA9IHtcbiAgICBpZDogYXNzZXQuaWQsXG4gICAgcGF0aHM6IGFzc2V0LnBhdGhzLFxuICAgIGFzc2V0R3JvdXA6IGFzc2V0LmFzc2V0R3JvdXAsXG4gICAgZmluZ2VycHJpbnQ6IGFzc2V0LmZpbmdlcnByaW50XG4gIH1cblxuICBpZiAoYXNzZXQuYXNzZXRHcm91cCA9PT0gJ2RhdGFfc291cmNlcycpIHtcbiAgICBvdXRwdXQgPSBPYmplY3QuYXNzaWduKG91dHB1dCwge1xuICAgICAgZGF0YTogYXNzZXQuZGF0YVxuICAgIH0pXG4gIH1cblxuICBpZiAoYXNzZXQuYXNzZXRHcm91cCA9PT0gJ2RvY3VtZW50cycpIHtcbiAgICBvdXRwdXQgPSBPYmplY3QuYXNzaWduKG91dHB1dCwge1xuICAgICAgbWFya2Rvd246IGFzc2V0LnJhdyxcbiAgICAgIGFzdDogYXNzZXQuaW5kZXhlZCxcbiAgICAgIGluZGV4ZXM6IGFzc2V0LmluZGV4ZXMsXG4gICAgICBodG1sOiBhc3NldC5odG1sLmNvbnRlbnRcbiAgICB9KVxuICB9XG5cbiAgd3JpdGUob3V0UGF0aCwgYG1vZHVsZS5leHBvcnRzID0gJHsgSlNPTi5zdHJpbmdpZnkob3V0cHV0KSB9O2ApXG5cbiAgcmV0dXJuIHtcbiAgICByZXF1aXJlUGF0aFxuICB9XG59XG5cbmNvbnN0IEluY2x1ZGVFeHBvcnRlcnMgPSBbJ2Fzc2V0cycsICdlbnRpdGllcycsICdwcm9qZWN0JywgJ21vZGVscycgXVxuXG5leHBvcnQgZnVuY3Rpb24gUHJvamVjdEV4cG9ydGVyIChvcHRpb25zID0ge30sIGNhbGxiYWNrKSB7XG4gIGxldCBwcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0XG5cbiAgaWYgKG9wdGlvbnMucnVuSW5jbHVkZWQgIT09IGZhbHNlKSB7XG4gICAgSW5jbHVkZUV4cG9ydGVycy5mb3JFYWNoKGV4cG9ydGVyID0+XG4gICAgICBydW5BbmRTYXZlKHByb2plY3QsIGV4cG9ydGVyLCBvcHRpb25zKVxuICAgIClcbiAgfVxuXG4gIGxldCBsaW5lcyA9IFtcbiAgICBgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9wcm9qZWN0LWV4cG9ydC5qc29uJyk7YCxcbiAgICBgZXhwb3J0cy5lbnRpdGllcyA9IHJlcXVpcmUoJy4vZW50aXRpZXMtZXhwb3J0Lmpzb24nKTtgLFxuICAgIGBleHBvcnRzLmFzc2V0cyA9IHJlcXVpcmUoJy4vYXNzZXRzLWV4cG9ydC5qc29uJyk7YCxcbiAgICBgZXhwb3J0cy5tb2RlbHMgPSByZXF1aXJlKCcuL21vZGVscy1leHBvcnQuanNvbicpO2AsXG4gICAgYGV4cG9ydHMuY29udGVudCA9IHt9YFxuICBdXG5cbiAga2V5cyhwcm9qZWN0LmNvbnRlbnQpLmZvckVhY2goa2V5ID0+IHtcbiAgICBsaW5lcy5wdXNoKGB2YXIgXyR7IGtleSB9ID0gZXhwb3J0cy5jb250ZW50LiR7IGtleSB9ID0ge307YClcblxuICAgIHByb2plY3QuY29udGVudFtrZXldLmZvckVhY2goYXNzZXQgPT4ge1xuICAgICAgbGV0IHsgcmVxdWlyZVBhdGggfSA9IEFzc2V0RXhwb3J0ZXIuY2FsbChwcm9qZWN0LCB7IGFzc2V0LCBvcHRpb25zLCBrZXkgfSlcbiAgICAgIGxpbmVzLnB1c2goYF8keyBrZXkgfVsnJHsgYXNzZXQuaWQgfSddID0gcmVxdWlyZSgnLi8ke3JlcXVpcmVQYXRofScpO2ApXG4gICAgfSlcbiAgfSlcblxuICByZXR1cm4gd3JpdGUoXG4gICAgcHJvamVjdC5wYXRoKCdidWlsZCcsJ2J1bmRsZScsJ2luZGV4LmpzJyksIGxpbmVzLmpvaW4oXCJcXG5cIilcbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBCcm93c2VyQnVuZGxlXG5cbmZ1bmN0aW9uIHJ1bkFuZFNhdmUocHJvamVjdCwgZXhwb3J0ZXIsIG9wdGlvbnMpIHtcbiAgd3JpdGUgKFxuICAgIHByb2plY3QucGF0aCgnYnVpbGQnLCAnYnVuZGxlJywgYCR7IGV4cG9ydGVyIH0tZXhwb3J0Lmpzb25gKSxcbiAgICBKU09OLnN0cmluZ2lmeShwcm9qZWN0LnJ1bi5leHBvcnRlcihleHBvcnRlciwgb3B0aW9ucykpXG4gIClcbn1cblxuZnVuY3Rpb24gbWtkaXIoLi4uYXJncykge1xuICAgcmV0dXJuIHJlcXVpcmUoJ21rZGlycCcpLnN5bmMoLi4uYXJncylcbn1cblxuZnVuY3Rpb24gd3JpdGUocGF0aCwgY29udGVudHMpIHtcbiAgbWtkaXIocmVxdWlyZSgncGF0aCcpLmRpcm5hbWUocGF0aCkpXG4gIHJlcXVpcmUoJ2ZzJykud3JpdGVGaWxlU3luYyhwYXRoLCBjb250ZW50cywgJ3V0ZjgnKVxuXG4gIHJldHVybiBjb250ZW50c1xufVxuXG5mdW5jdGlvbiBleGlzdHMoLi4uYXJncykge1xuICAgcmV0dXJuIHJlcXVpcmUoJ2ZzJykuZXhpc3RzU3luYyguLi5hcmdzKVxufVxuXG5jb25zdCB7IGtleXMgfSA9IE9iamVjdFxuIl19