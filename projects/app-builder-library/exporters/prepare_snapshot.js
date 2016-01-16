/**
 * @description THis is a temporary approach until i solidify the framework snapshot and what it includes
*/
module.exports = function prepare_snapshot (options) {
  options = options || {}

  var project = options.project = options.project || this,
      snapshot = project.run.exporter('snapshot');

  return snapshot
}
