'use strict';

var _path = require('path');

var _util = require('../util');

module.exports = {
  scripts: scripts,
  styles: styles,
  variables: variables
};

var variables = (0, _util.extractLessVars)((0, _path.join)(__dirname, '../../packages/bootstrap/variables.less'));

var scripts = ['transition', 'alert', 'button', 'carousel', 'collapse', 'dropdown', 'modal', 'tooltip', 'popover', 'scrollspy', 'tab', 'affix'];

var styles = ["variables", "mixins", "normalize", "print", "scaffolding", "type", "code", "grid", "tables", "forms", "buttons", "component-animations", "glyphicons", "dropdowns", "button-groups", "input-groups", "navs", "navbar", "breadcrumbs", "pagination", "pager", "labels", "badges", "jumbotron", "thumbnails", "alerts", "progress-bars", "media", "list-group", "panels", "wells", "close", "modals", "tooltip", "popovers", "carousel", "utilities", "responsive-utilities"];