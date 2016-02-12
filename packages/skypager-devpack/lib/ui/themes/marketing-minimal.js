'use strict';

module.exports = function MarketingMinimal() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var env = options.env;
  var directory = options.directory;
  var theme = options.theme;

  return 'skypager-themes?theme=' + (theme || 'marketing-minimal') + '&env=' + env + '!' + directory + '/package.json';
};