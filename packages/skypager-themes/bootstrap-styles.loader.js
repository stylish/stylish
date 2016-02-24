import { availableThemes } from './lib'

var querystring = require('querystring')

var styles = [
  "variables",
  "mixins",

  "normalize",
  "print",

  "scaffolding",
  "type",
  "code",
  "grid",
  "tables",
  "forms",
  "buttons",

  "component-animations",
  //"glyphicons",
  "dropdowns",
  "button-groups",
  "input-groups",
  "navs",
  "navbar",
  "breadcrumbs",
  "pagination",
  "pager",
  "labels",
  "badges",
  "jumbotron",
  "thumbnails",
  "alerts",
  "progress-bars",
  "media",
  "list-group",
  "panels",
  "wells",
  "close",

  "modals",
  "tooltip",
  "popovers",
  "carousel",

  "utilities",
  "responsive-utilities"
];

module.exports = function (content) {
  this.cacheable(true);

  var query = {};
  var config = {};

  try {
    config = JSON.parse(content)

    if (config.skypager) {
      config = config.skypager
    }
  } catch(error) {

  }

  if (this.query && this.query.replace) {
    query = Object.assign(query, querystring.parse(this.query.replace(/^\?/,'')))
  } else {
    query = {}
  }

  var theme = query.theme || config.theme;

  var output;

  if (theme === 'bootstrap' || !availableThemes()[theme]) {
    output = styles.map(function(style) { return `@import '~skypager-themes/packages/bootstrap/${style}.less';` }).join("\n")
  } else if (availableThemes()[theme]) {
    output = `@import '~skypager-themes/packages/${ theme }/index.less';`
  }

  return output;
}
