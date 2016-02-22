var scripts = [
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

module.exports = function () {};
module.exports.pitch = function (configPath) {
  this.cacheable(true);

  /*
  // TODO: Implement some version of this but for now make the full themed version work
  var config = { scripts: {}, styles: {} }

  var enabledScripts = scripts.filter(function (script) {
    return config.scripts[script];
  })
  */

  return [
    "require('!expose?jQuery!jquery');"
  ].concat(scripts.map(function (script) {
    return "require(" + JSON.stringify("bootstrap/js/" + script) + ");";
  }))
  .join("\n");
}
