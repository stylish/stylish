'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Layouts = undefined;
exports.HtmlRenderer = HtmlRenderer;
exports.AssetRenderer = AssetRenderer;
exports.ProjectRenderer = ProjectRenderer;

var _util = require('../util');

var _renderer = require('../assets/document/renderer');

function HtmlRenderer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var project = options.project = options.project || this;

    if (options.asset) {
        return AssetRenderer.apply(project, arguments);
    }

    return ProjectRenderer.apply(project, arguments);
}

function AssetRenderer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var _options = options;
    var asset = _options.asset;
    var project = _options.project;
    var target = _options.target;

    if (asset.assetClass.name !== 'Document') {
        throw 'Do not know how to render this type of asset into HTML';
    }

    var ast = (0, _util.clone)(asset[target || 'transformed']);

    var rendered = undefined;

    try {
        rendered = (0, _renderer.html)(asset.transformed, options = {});
    } catch (error) {
        rendered = error.message;
    }

    return rendered;
}

function ProjectRenderer() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var project = options.project = options.project || this;
    var payload = project.documents.all.map(function (asset) {
        return AssetRenderer.call(project, Object.assign({}, options, { asset: asset }));
    });

    return Layouts[options.layout || 'none']({
        title: options.title || project.name,
        headScriptsPayload: '',
        stylesPayload: '',
        scriptsPayload: '',
        bodyId: "",
        bodyClass: "",
        rootId: 'root',
        contentPayload: payload.join("\n")
    });
}

var Layouts = exports.Layouts = {
    basic: basic,
    none: function none(_ref) {
        var contentPayload = _ref.contentPayload;

        return contentPayload;
    }
};

function basic() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var title = options.title;
    var rootId = options.rootId;
    var headScriptsPayload = options.headScriptsPayload;
    var stylesPayload = options.stylesPayload;
    var bodyId = options.bodyId;
    var bodyClass = options.bodyClass;
    var contentPayload = options.contentPayload;
    var scriptsPayload = options.scriptsPayload;

    return '<html>\n        <head>\n            <title>' + title + '</title>\n            ' + headScriptsPayload + '\n            ' + stylesPayload + '\n        </head>\n        <body id="' + bodyId + '" class="' + bodyClass + '">\n            <div id=' + rootId + ' class="project container">\n                ' + contentPayload + '\n            </div>\n            ' + scriptsPayload + '\n        </body></html>';
}

exports.default = HtmlRenderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW5kZXJlcnMvaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFHZ0IsWUFBWSxHQUFaLFlBQVk7UUFVWixhQUFhLEdBQWIsYUFBYTtRQW9CYixlQUFlLEdBQWYsZUFBZTs7Ozs7O0FBOUJ4QixTQUFTLFlBQVksR0FBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3hDLFFBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUE7O0FBRXZELFFBQUksT0FBTyxDQUFDLEtBQUssRUFBRTtBQUNqQixlQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFBO0tBQy9DOztBQUVELFdBQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUE7Q0FDakQ7O0FBRU0sU0FBUyxhQUFhLEdBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFO21CQUNOLE9BQU87UUFBbEMsS0FBSyxZQUFMLEtBQUs7UUFBRSxPQUFPLFlBQVAsT0FBTztRQUFFLE1BQU0sWUFBTixNQUFNOztBQUU1QixRQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtBQUN0QyxjQUFNLHdEQUF3RCxDQUFDO0tBQ2xFOztBQUVELFFBQUksR0FBRyxHQUFHLFVBcEJMLEtBQUssRUFvQk0sS0FBSyxDQUFDLE1BQU0sSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFBOztBQUUvQyxRQUFJLFFBQVEsWUFBQSxDQUFBOztBQUVaLFFBQUk7QUFDQSxnQkFBUSxHQUFHLGNBeEJWLElBQUksRUF3QlcsS0FBSyxDQUFDLFdBQVcsRUFBRSxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUE7S0FDbkQsQ0FBQyxPQUFNLEtBQUssRUFBRTtBQUNYLGdCQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQTtLQUMzQjs7QUFFRCxXQUFPLFFBQVEsQ0FBQTtDQUNsQjs7QUFFTSxTQUFTLGVBQWUsR0FBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3pDLFFBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUE7QUFDdkQsUUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztlQUFJLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFDLEtBQUssRUFBTCxLQUFLLEVBQUMsQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFBOztBQUVsSCxXQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDO0FBQ3JDLGFBQUssRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJO0FBQ3BDLDBCQUFrQixFQUFFLEVBQUU7QUFDdEIscUJBQWEsRUFBRSxFQUFFO0FBQ2pCLHNCQUFjLEVBQUUsRUFBRTtBQUNsQixjQUFNLEVBQUUsRUFBRTtBQUNWLGlCQUFTLEVBQUUsRUFBRTtBQUNiLGNBQU0sRUFBRSxNQUFNO0FBQ2Qsc0JBQWMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztLQUNyQyxDQUFDLENBQUE7Q0FDTDs7QUFFTSxJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUc7QUFDbkIsU0FBSyxFQUFMLEtBQUs7QUFDTCxRQUFJLHNCQUFrQjtZQUFoQixjQUFjLFFBQWQsY0FBYzs7QUFDaEIsZUFBTyxjQUFjLENBQUE7S0FDeEI7Q0FDSixDQUFBOztBQUVELFNBQVMsS0FBSyxHQUFlO1FBQWQsT0FBTyx5REFBRyxFQUFFO1FBQ2pCLEtBQUssR0FBbUcsT0FBTyxDQUEvRyxLQUFLO1FBQUUsTUFBTSxHQUEyRixPQUFPLENBQXhHLE1BQU07UUFBRSxrQkFBa0IsR0FBdUUsT0FBTyxDQUFoRyxrQkFBa0I7UUFBRSxhQUFhLEdBQXdELE9BQU8sQ0FBNUUsYUFBYTtRQUFFLE1BQU0sR0FBZ0QsT0FBTyxDQUE3RCxNQUFNO1FBQUUsU0FBUyxHQUFxQyxPQUFPLENBQXJELFNBQVM7UUFBRSxjQUFjLEdBQXFCLE9BQU8sQ0FBMUMsY0FBYztRQUFFLGNBQWMsR0FBSyxPQUFPLENBQTFCLGNBQWM7O0FBRXpHLDJEQUVrQixLQUFLLDhCQUNaLGtCQUFrQixzQkFDbEIsYUFBYSw2Q0FFUCxNQUFNLGlCQUFjLFNBQVMsZ0NBQzNCLE1BQU0scURBQ1YsY0FBYywwQ0FFbEIsY0FBYyw4QkFDTDtDQUN2Qjs7a0JBRWMsWUFBWSIsImZpbGUiOiJodG1sLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvbmUgfSBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHsgaHRtbCwgcmVuZGVyZXIgfSBmcm9tICcuLi9hc3NldHMvZG9jdW1lbnQvcmVuZGVyZXInXG5cbmV4cG9ydCBmdW5jdGlvbiBIdG1sUmVuZGVyZXIgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzXG5cbiAgaWYgKG9wdGlvbnMuYXNzZXQpIHtcbiAgICByZXR1cm4gQXNzZXRSZW5kZXJlci5hcHBseShwcm9qZWN0LCBhcmd1bWVudHMpXG4gIH1cblxuICByZXR1cm4gUHJvamVjdFJlbmRlcmVyLmFwcGx5KHByb2plY3QsIGFyZ3VtZW50cylcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEFzc2V0UmVuZGVyZXIgKG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCB7IGFzc2V0LCBwcm9qZWN0LCB0YXJnZXQgfSA9IG9wdGlvbnNcblxuICAgIGlmIChhc3NldC5hc3NldENsYXNzLm5hbWUgIT09ICdEb2N1bWVudCcpIHtcbiAgICAgICAgdGhyb3coJ0RvIG5vdCBrbm93IGhvdyB0byByZW5kZXIgdGhpcyB0eXBlIG9mIGFzc2V0IGludG8gSFRNTCcpXG4gICAgfVxuXG4gICAgbGV0IGFzdCA9IGNsb25lKGFzc2V0W3RhcmdldCB8fCAndHJhbnNmb3JtZWQnXSlcblxuICAgIGxldCByZW5kZXJlZFxuXG4gICAgdHJ5IHtcbiAgICAgICAgcmVuZGVyZWQgPSBodG1sKGFzc2V0LnRyYW5zZm9ybWVkLCBvcHRpb25zID0ge30pXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZW5kZXJlZCA9IGVycm9yLm1lc3NhZ2VcbiAgICB9XG5cbiAgICByZXR1cm4gcmVuZGVyZWRcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFByb2plY3RSZW5kZXJlciAob3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHByb2plY3QgPSBvcHRpb25zLnByb2plY3QgPSBvcHRpb25zLnByb2plY3QgfHwgdGhpc1xuICAgIGxldCBwYXlsb2FkID0gcHJvamVjdC5kb2N1bWVudHMuYWxsLm1hcChhc3NldCA9PiBBc3NldFJlbmRlcmVyLmNhbGwocHJvamVjdCwgT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucywge2Fzc2V0fSkpKVxuXG4gICAgcmV0dXJuIExheW91dHNbb3B0aW9ucy5sYXlvdXQgfHwgJ25vbmUnXSh7XG4gICAgICAgIHRpdGxlOiBvcHRpb25zLnRpdGxlIHx8IHByb2plY3QubmFtZSxcbiAgICAgICAgaGVhZFNjcmlwdHNQYXlsb2FkOiAnJyxcbiAgICAgICAgc3R5bGVzUGF5bG9hZDogJycsXG4gICAgICAgIHNjcmlwdHNQYXlsb2FkOiAnJyxcbiAgICAgICAgYm9keUlkOiBcIlwiLFxuICAgICAgICBib2R5Q2xhc3M6IFwiXCIsXG4gICAgICAgIHJvb3RJZDogJ3Jvb3QnLFxuICAgICAgICBjb250ZW50UGF5bG9hZDogcGF5bG9hZC5qb2luKFwiXFxuXCIpXG4gICAgfSlcbn1cblxuZXhwb3J0IGNvbnN0IExheW91dHMgPSB7XG4gICAgYmFzaWMsXG4gICAgbm9uZSh7Y29udGVudFBheWxvYWR9KXtcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRQYXlsb2FkXG4gICAgfVxufVxuXG5mdW5jdGlvbiBiYXNpYyhvcHRpb25zID0ge30pIHtcbiAgICBsZXQgeyB0aXRsZSwgcm9vdElkLCBoZWFkU2NyaXB0c1BheWxvYWQsIHN0eWxlc1BheWxvYWQsIGJvZHlJZCwgYm9keUNsYXNzLCBjb250ZW50UGF5bG9hZCwgc2NyaXB0c1BheWxvYWQgfSA9IG9wdGlvbnNcblxuICAgIHJldHVybiAoYDxodG1sPlxuICAgICAgICA8aGVhZD5cbiAgICAgICAgICAgIDx0aXRsZT4keyB0aXRsZSB9PC90aXRsZT5cbiAgICAgICAgICAgICR7IGhlYWRTY3JpcHRzUGF5bG9hZCB9XG4gICAgICAgICAgICAkeyBzdHlsZXNQYXlsb2FkIH1cbiAgICAgICAgPC9oZWFkPlxuICAgICAgICA8Ym9keSBpZD1cIiR7IGJvZHlJZCB9XCIgY2xhc3M9XCIkeyBib2R5Q2xhc3MgfVwiPlxuICAgICAgICAgICAgPGRpdiBpZD0keyByb290SWQgfSBjbGFzcz1cInByb2plY3QgY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgJHsgY29udGVudFBheWxvYWQgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAkeyBzY3JpcHRzUGF5bG9hZCB9XG4gICAgICAgIDwvYm9keT48L2h0bWw+YClcbn1cblxuZXhwb3J0IGRlZmF1bHQgSHRtbFJlbmRlcmVyXG4iXX0=