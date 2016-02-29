"use strict";

module.exports = exports = function run_copy_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var project = context.project || this;

  return project.copy;
};