'use strict';

action('scaffold project');

describe('generate the project scaffolding');

execute(function () {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _ref = arguments[1];
  var project = _ref.project;

  var mkdir = require('mkdirp').sync;
  var map = require('lodash/mapValues');

  values(project.paths).forEach(function (path) {
    if (!path.match(/\.\w+/)) {
      console.log('  Creating ', path, mkdir(path));
    }
  });
});