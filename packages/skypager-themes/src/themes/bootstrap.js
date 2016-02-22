import { join } from 'path'
import { extractLessVars } from '../util'

module.exports = {
  scripts,
  styles,
  variables
}

const variables = extractLessVars(
  join(__dirname, '../../packages/bootstrap/variables.less')
)

const scripts = [
  'transition',
  'alert',
  'button',
  'carousel',
  'collapse',
  'dropdown',
  'modal',
  'tooltip',
  'popover',
  'scrollspy',
  'tab',
  'affix'
]


const styles = [
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
  "glyphicons",
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
]
