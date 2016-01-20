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

  if (this.query) {
    query = Object.assign(query, querystring.parse(this.query.replace(/^\?/,'')))
  }

  var theme = query.theme || config.theme;

  if (theme) {
    return `@import '~skypager-themes/${ theme.replace(/-\w+$/,'') }/${ theme }.less';`
  } else {
    return styles.map(function(style) {
      return `@import '~skypager-themes/bootstrap/${style}.less';`
    }).join("\n")
  }
}
