'use strict';

plugin('Integrations');

modify(function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var host = options.project || options.host || require('skypager');

  host.models.runLoader(require('./models'));
  host.actions.runLoader(require('./actions'));
});