'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportAll = ExportAll;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EXPORTERS = exports.EXPORTERS = ['assets', 'content', 'entities', 'models', 'project'];

function ExportAll() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = params.project = params.project || this;

  project.allAssets.forEach(function (asset) {
    try {
      if (!asset.raw) {
        asset.runImporter('disk', { sync: true });
      }
    } catch (error) {
      console.log('error importing asset: ' + asset.id);
      throw error;
    }
  });

  return EXPORTERS.reduce(function (memo, exporter) {
    return Object.assign(memo, _defineProperty({}, exporter, project.run.exporter(exporter, params)));
  }, {});
}

exports.default = ExportAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9leHBvcnRlcnMvYWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBUWdCLFNBQVMsR0FBVCxTQUFTOzs7O0FBUmxCLElBQU0sU0FBUyxXQUFULFNBQVMsR0FBRyxDQUN2QixRQUFRLEVBQ1IsU0FBUyxFQUNULFVBQVUsRUFDVixRQUFRLEVBQ1IsU0FBUyxDQUNWLENBQUE7O0FBRU0sU0FBUyxTQUFTLEdBQWU7TUFBYixNQUFNLHlEQUFHLEVBQUU7O0FBQ3BDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEdBQUksTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLEFBQUMsQ0FBQTs7QUFFekQsU0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDakMsUUFBSTtBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQUUsYUFBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtPQUFFO0tBQzVELENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxhQUFPLENBQUMsR0FBRyw2QkFBNEIsS0FBSyxDQUFDLEVBQUUsQ0FBSSxDQUFBO0FBQ25ELFlBQU0sS0FBSyxDQUFDO0tBQ2I7R0FDRixDQUFDLENBQUE7O0FBRUYsU0FBTyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBSztBQUMxQyxXQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxzQkFDdEIsUUFBUSxFQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFDbEQsQ0FBQTtHQUNILEVBQUUsRUFBRSxDQUFDLENBQUE7Q0FDUDs7a0JBRWMsU0FBUyIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgRVhQT1JURVJTID0gW1xuICAnYXNzZXRzJyxcbiAgJ2NvbnRlbnQnLFxuICAnZW50aXRpZXMnLFxuICAnbW9kZWxzJyxcbiAgJ3Byb2plY3QnXG5dXG5cbmV4cG9ydCBmdW5jdGlvbiBFeHBvcnRBbGwgKHBhcmFtcyA9IHt9KSB7XG4gIGNvbnN0IHByb2plY3QgPSBwYXJhbXMucHJvamVjdCA9IChwYXJhbXMucHJvamVjdCB8fCB0aGlzKVxuXG4gIHByb2plY3QuYWxsQXNzZXRzLmZvckVhY2goYXNzZXQgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWFzc2V0LnJhdykgeyBhc3NldC5ydW5JbXBvcnRlcignZGlzaycsIHtzeW5jOiB0cnVlfSkgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhgZXJyb3IgaW1wb3J0aW5nIGFzc2V0OiAkeyBhc3NldC5pZCB9YClcbiAgICAgIHRocm93KGVycm9yKVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gRVhQT1JURVJTLnJlZHVjZSgobWVtbywgZXhwb3J0ZXIpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBbZXhwb3J0ZXJdOiBwcm9qZWN0LnJ1bi5leHBvcnRlcihleHBvcnRlciwgcGFyYW1zKVxuICAgIH0pXG4gIH0sIHt9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHBvcnRBbGxcbiJdfQ==