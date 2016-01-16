'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomWrapper = DomWrapper;

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _cheerioSelect = require('cheerio-select');

var _cheerioSelect2 = _interopRequireDefault(_cheerioSelect);

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
        css: function css(selector) {
            return (0, _cheerioSelect2.default)(selector, dom);
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hc3NldHMvcGFyc2Vycy9odG1sLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBR2dCLFVBQVUsR0FBVixVQUFVOzs7Ozs7Ozs7Ozs7QUFBbkIsU0FBUyxVQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUN2QyxRQUFJLEdBQUcsR0FBRyxrQkFBUSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7O0FBRS9CLFdBQU87QUFDSCxZQUFJLEtBQUssR0FBRztBQUNSLG1CQUFPLEtBQUssQ0FBQTtTQUNmO0FBQ0QsWUFBSSxPQUFPLEdBQUc7QUFDVixtQkFBTyxPQUFPLENBQUE7U0FDakI7QUFDRCxZQUFJLEdBQUcsR0FBRztBQUNOLG1CQUFPLEdBQUcsQ0FBQTtTQUNiO0FBQ0QsV0FBRyxlQUFDLFFBQVEsRUFBRTtBQUNWLG1CQUFPLDZCQUFPLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUMvQjtLQUNKLENBQUE7Q0FDSiIsImZpbGUiOiJodG1sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNoZWVyaW8gZnJvbSAnY2hlZXJpbydcbmltcG9ydCBzZWxlY3QgZnJvbSAnY2hlZXJpby1zZWxlY3QnXG5cbmV4cG9ydCBmdW5jdGlvbiBEb21XcmFwcGVyKGNvbnRlbnQsIGFzc2V0KSB7XG4gICAgbGV0IGRvbSA9IGNoZWVyaW8ubG9hZChjb250ZW50KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0IGFzc2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGFzc2V0XG4gICAgICAgIH0sXG4gICAgICAgIGdldCBjb250ZW50KCkge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0IGRvbSgpIHtcbiAgICAgICAgICAgIHJldHVybiBkb21cbiAgICAgICAgfSxcbiAgICAgICAgY3NzKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZWN0KHNlbGVjdG9yLCBkb20pXG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=