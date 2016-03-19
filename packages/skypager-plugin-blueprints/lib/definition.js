'use strict';

plugin("Blueprints");

modify(function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var host = options.project || options.host || require('skypager-project');

  //host.importers.runLoader(require('./importers'))
  //host.exporters.runLoader(require('./exporters'))
  host.models.runLoader(require('./models'));
});