"use strict";

module.exports = function run_settings_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;

  return project.settings;
};