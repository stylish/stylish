'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _mdast = require('mdast');

var _mdast2 = _interopRequireDefault(_mdast);

var _mdastYaml = require('mdast-yaml');

var _mdastYaml2 = _interopRequireDefault(_mdastYaml);

var _mdastHtml = require('mdast-html');

var _mdastHtml2 = _interopRequireDefault(_mdastHtml);

var _mdastSqueezeParagraphs = require('mdast-squeeze-paragraphs');

var _mdastSqueezeParagraphs2 = _interopRequireDefault(_mdastSqueezeParagraphs);

var _mdastNormalizeHeadings = require('mdast-normalize-headings');

var _mdastNormalizeHeadings2 = _interopRequireDefault(_mdastNormalizeHeadings);

var _unistUtilVisit = require('unist-util-visit');

var _unistUtilVisit2 = _interopRequireDefault(_unistUtilVisit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var markdown = _mdast2.default.use([_mdastYaml2.default, _mdastSqueezeParagraphs2.default, _mdastNormalizeHeadings2.default, _mdastHtml2.default]);

function parse(content, document) {
  return markdown.parse(content);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQvcGFyc2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O2tCQVN3QixLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRjdCLElBQU0sUUFBUSxHQUFHLGdCQUFNLEdBQUcsQ0FBQyw4R0FBZ0MsQ0FBQyxDQUFBOztBQUU3QyxTQUFTLEtBQUssQ0FBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2hELFNBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtDQUMvQiIsImZpbGUiOiJwYXJzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbWRhc3QgZnJvbSAnbWRhc3QnXG5pbXBvcnQgeWFtbCBmcm9tICdtZGFzdC15YW1sJ1xuaW1wb3J0IGh0bWwgZnJvbSAnbWRhc3QtaHRtbCdcbmltcG9ydCBzcXVlZXplIGZyb20gJ21kYXN0LXNxdWVlemUtcGFyYWdyYXBocydcbmltcG9ydCBub3JtYWxpemUgZnJvbSAnbWRhc3Qtbm9ybWFsaXplLWhlYWRpbmdzJ1xuaW1wb3J0IHZpc2l0IGZyb20gJ3VuaXN0LXV0aWwtdmlzaXQnXG5cbmNvbnN0IG1hcmtkb3duID0gbWRhc3QudXNlKFt5YW1sLCBzcXVlZXplLCBub3JtYWxpemUsIGh0bWxdKVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwYXJzZSAoY29udGVudCwgZG9jdW1lbnQpIHtcbiAgcmV0dXJuIG1hcmtkb3duLnBhcnNlKGNvbnRlbnQpXG59XG4iXX0=