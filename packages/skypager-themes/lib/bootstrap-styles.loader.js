"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var querystring = require('querystring');

var styles = ["variables", "mixins", "normalize", "print", "scaffolding", "type", "code", "grid", "tables", "forms", "buttons", "component-animations",
//"glyphicons",
"dropdowns", "button-groups", "input-groups", "navs", "navbar", "breadcrumbs", "pagination", "pager", "labels", "badges", "jumbotron", "thumbnails", "alerts", "progress-bars", "media", "list-group", "panels", "wells", "close", "modals", "tooltip", "popovers", "carousel", "utilities", "responsive-utilities"];

module.exports = function (content) {
  this.cacheable(true);

  var query = {};
  var config = {};

  if (this.query) {
    query = (0, _assign2.default)(query, querystring.parse(this.query.replace(/^\?/, '')));
  }

  if (content && query.configPath) {
    try {
      if (query.configPath.match(/yml/)) {
        config = require('js-yaml').load(content);
      }

      if (query.configPath.match(/json/)) {
        config = JSON.parse(content);
      }
    } catch (error) {
      this.emitError("Error parsing config file for skypager-theme : " + error.message);
    }
  }

  var theme = query.theme || config.theme;

  var output;

  if (theme) {
    output = "@import '~skypager-themes/packages/" + theme.replace(/-\w+$/, '') + "/" + theme + ".less';";
  } else {
    output = styles.map(function (style) {
      return "@import '~skypager-themes/packages/bootstrap/" + style + ".less';";
    }).join("\n");
  }

  return output;
};
