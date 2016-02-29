"use strict";

module.exports = function run_model_definitions_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;
  var definitions = project.modelDefinitions || {};

  return definitions;
};