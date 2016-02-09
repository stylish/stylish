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