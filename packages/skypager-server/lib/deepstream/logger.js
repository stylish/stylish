'use strict';

var C = require('deepstream.io').constants,
    EOL = require('os').EOL,
    writeable = require('fs').createWriteStream;

/**
 * Logs to the operatingsystem's standard-out and standard-error streams.
 *
 * Consoles / Terminals as well as most log-managers and logging systems
 * consume messages from these streams
 *
 * @constructor
 */

var join = require('path').join;

var Logger = function Logger() {
  var name = arguments.length <= 0 || arguments[0] === undefined ? 'deepstream' : arguments[0];
  var options = arguments[1];

  this.isReady = true;
  this._$useColors = true;
  this._logLevelColors = ['white', 'green', 'yellow', 'red'];

  this.logs = writeable(join(options.logPath, name + '.log'));

  this._currentLogLevel = 0;
};

/**
 * Logs a line
 *
 * @param   {Number} logLevel   One of the C.LOG_LEVEL constants
 * @param   {String} event      One of the C.EVENT constants
 * @param   {String} logMessage Any string
 *
 * @public
 * @returns {void}
 */
Logger.prototype.log = function (logLevel, event, logMessage) {
  if (logLevel < this._currentLogLevel) {
    return;
  }

  var msg = event + ' | ' + logMessage;

  if (logLevel === C.LOG_LEVEL.ERROR || logLevel === C.LOG_LEVEL.WARN) {
    this.logs.write(msg[this._logLevelColors[logLevel]] + EOL);
  } else {
    this.logs.write(msg[this._logLevelColors[logLevel]] + EOL);
  }
};

/**
 * Sets the log-level. This can be called at runtime.
 *
 * @param   {Number} logLevel   One of the C.LOG_LEVEL constants
 *
 * @public
 * @returns {void}
 */
Logger.prototype.setLogLevel = function (logLevel) {
  this._currentLogLevel = logLevel;
};

module.exports = function (path) {
  return new Logger(path);
};