'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Layouts = undefined;
exports.HtmlRenderer = HtmlRenderer;
exports.AssetRenderer = AssetRenderer;
exports.ProjectRenderer = ProjectRenderer;

var _util = require('../util');

var _renderer = require('../assets/document/renderer');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        return AssetRenderer.call(project, (0, _assign2.default)({}, options, { asset: asset }));
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