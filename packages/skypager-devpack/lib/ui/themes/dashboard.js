"use strict";

module.exports = function Dashboard() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var env = options.env;
  var directory = options.directory;
  var theme = options.theme;

  return "skypager-themes?theme=" + theme + "&env=" + env + "!" + directory + "/package.json";
};