'use strict';

plugin("Blueprints");

modify(function (options) {
  var host = options.project || options.host || require('skypager');
  host.models.runLoader(require('./models'));
});