'use strict';

plugin('Portfolio');

modify(function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var host = options.host || options.project;

  host.actions.runLoader(require('./actions'));
});