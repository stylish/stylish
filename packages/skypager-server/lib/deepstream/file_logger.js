'use strict';

var C = require('deepstream.io/lib/constants/constants'),
    EOL = require('os').EOL;

/**
 * Logs to the operatingsystem's standard-out and standard-error streams.
 *
 * Consoles / Terminals as well as most log-managers and logging systems
 * consume messages from these streams
 *
 * @constructor
 */
var Logger = function Logger(path) {
	this.path = require('path').resolve(path);
	this.isReady = true;
	this._$useColors = true;
	this._logLevelColors = ['white', 'green', 'yellow', 'red'];

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

	var msg = event + ' | ' + logMessage,
	    logStream;

	if (logLevel === C.LOG_LEVEL.ERROR || logLevel === C.LOG_LEVEL.WARN) {
		logStream = writeable(this.logPath);
	} else {
		logStream = writeable(this.logPath);
	}

	if (this._$useColors) {
		logStream.write(msg[this._logLevelColors[logLevel]] + EOL);
	} else {
		logStream.write(msg + EOL);
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