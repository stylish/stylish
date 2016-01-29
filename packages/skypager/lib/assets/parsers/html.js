'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomWrapper = DomWrapper;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _cheerioSelect = require('cheerio-select');

var _cheerioSelect2 = _interopRequireDefault(_cheerioSelect);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DomWrapper(content, asset) {
    var dom = _cheerio2.default.load(content);

    return {
        get asset() {
            return asset;
        },
        get content() {
            return content;
        },
        get dom() {
            return dom;
        },
        section: function section(title, additional) {
            return dom('section#' + (0, _util.slugify)(title) + ' ' + additional);
        },
        css: function css() {
            return dom.apply(undefined, arguments);
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvcGFyc2Vycy9odG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBS2dCLFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7OztBQUFuQixTQUFTLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFO0FBQ3ZDLFFBQUksR0FBRyxHQUFHLGtCQUFRLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTs7QUFFL0IsV0FBTztBQUNILFlBQUksS0FBSyxHQUFHO0FBQ1IsbUJBQU8sS0FBSyxDQUFBO1NBQ2Y7QUFDRCxZQUFJLE9BQU8sR0FBRztBQUNWLG1CQUFPLE9BQU8sQ0FBQTtTQUNqQjtBQUNELFlBQUksR0FBRyxHQUFHO0FBQ04sbUJBQU8sR0FBRyxDQUFBO1NBQ2I7QUFDRCxlQUFPLG1CQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7QUFDekIsbUJBQU8sR0FBRyxjQUFZLFVBaEJ2QixPQUFPLEVBZ0J3QixLQUFLLENBQUMsU0FBSSxVQUFVLENBQUcsQ0FBQTtTQUN0RDtBQUNELFdBQUcsaUJBQVU7QUFDWCxtQkFBTyxHQUFHLDRCQUFTLENBQUE7U0FDcEI7S0FDSixDQUFBO0NBQ0oiLCJmaWxlIjoiaHRtbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGVlcmlvIGZyb20gJ2NoZWVyaW8nXG5pbXBvcnQgc2VsZWN0IGZyb20gJ2NoZWVyaW8tc2VsZWN0J1xuXG5pbXBvcnQgeyBzbHVnaWZ5IH0gZnJvbSAnLi4vLi4vdXRpbCdcblxuZXhwb3J0IGZ1bmN0aW9uIERvbVdyYXBwZXIoY29udGVudCwgYXNzZXQpIHtcbiAgICBsZXQgZG9tID0gY2hlZXJpby5sb2FkKGNvbnRlbnQpXG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXQgYXNzZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gYXNzZXRcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udGVudFxuICAgICAgICB9LFxuICAgICAgICBnZXQgZG9tKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRvbVxuICAgICAgICB9LFxuICAgICAgICBzZWN0aW9uKHRpdGxlLCBhZGRpdGlvbmFsKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbShgc2VjdGlvbiMke3NsdWdpZnkodGl0bGUpfSAke2FkZGl0aW9uYWx9YClcbiAgICAgICAgfSxcbiAgICAgICAgY3NzKC4uLmFyZ3MpIHtcbiAgICAgICAgICByZXR1cm4gZG9tKC4uLmFyZ3MpXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=