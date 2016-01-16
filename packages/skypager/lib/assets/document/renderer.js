'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderer = undefined;
exports.html = html;

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

var renderer = exports.renderer = _mdast2.default.use([_mdastYaml2.default, _mdastSqueezeParagraphs2.default, _mdastNormalizeHeadings2.default, _mdastHtml2.default]);

function html(ast) {
  return renderer.stringify(ast);
}

exports.default = html;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvZG9jdW1lbnQvcmVuZGVyZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBU2dCLElBQUksR0FBSixJQUFJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRmIsSUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLGdCQUFNLEdBQUcsQ0FBQyw4R0FBaUMsQ0FBQyxDQUFBOztBQUU3RCxTQUFTLElBQUksQ0FBRSxHQUFHLEVBQUU7QUFDekIsU0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0NBQy9COztrQkFFYyxJQUFJIiwiZmlsZSI6InJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1kYXN0IGZyb20gJ21kYXN0J1xuaW1wb3J0IHlhbWwgZnJvbSAnbWRhc3QteWFtbCdcbmltcG9ydCBfaHRtbCBmcm9tICdtZGFzdC1odG1sJ1xuaW1wb3J0IHNxdWVlemUgZnJvbSAnbWRhc3Qtc3F1ZWV6ZS1wYXJhZ3JhcGhzJ1xuaW1wb3J0IG5vcm1hbGl6ZSBmcm9tICdtZGFzdC1ub3JtYWxpemUtaGVhZGluZ3MnXG5pbXBvcnQgdmlzaXQgZnJvbSAndW5pc3QtdXRpbC12aXNpdCdcblxuZXhwb3J0IGNvbnN0IHJlbmRlcmVyID0gbWRhc3QudXNlKFt5YW1sLCBzcXVlZXplLCBub3JtYWxpemUsIF9odG1sXSlcblxuZXhwb3J0IGZ1bmN0aW9uIGh0bWwgKGFzdCkge1xuICByZXR1cm4gcmVuZGVyZXIuc3RyaW5naWZ5KGFzdClcbn1cblxuZXhwb3J0IGRlZmF1bHQgaHRtbFxuIl19