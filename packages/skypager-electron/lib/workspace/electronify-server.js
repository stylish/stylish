'use strict'

/* eslint no-path-concat: 0, func-names:0 */
// require('electron-debug')();
// require('crash-reporter').start();
// const crashReporter = require('electron').crashReporter;

// Imports
;
var app = require('app');
var util = require('util');
var colors = require('colors');
var EventEmitter = require('events');
var BrowserWindow = require('browser-window');
var exec = require('child-process-promise').exec;
// var dialog = require('electron').dialog;

var DEFAULT_WINDOW = { width: 1024, height: 728, show: false };
var NOOP = function NOOP() {};
var DEBUG = function DEBUG(text) {
  var time = new Date().toLocaleTimeString();
  console.log('['.grey + time.green + ']'.grey + colors.reset(' ' + text));
};

function electronify(cfg) {
  var self = this;

  // Initialize necessary properties from `EventEmitter` in this instance
  EventEmitter.call(self);

  // setup debug logger
  var debug = NOOP;
  if (cfg.debug) {
    debug = DEBUG;
  }

  app.on('window-all-closed', function () {
    debug('All windows closed.');

    // quit after last window is closed
    app.quit();
  });

  app.on('ready', function () {
    debug('App ready.');
    if (cfg.ready) cfg.ready(app);

    // The app will start with no command if the noServer option is true.
    if (cfg.noServer) {
      start(cfg, app, null, debug);
      return;

      // The app will quit if there is no command to run.
    } else if (!cfg.noServer && !cfg.command) {
        debug('No command configured!');
        self.emit('error', new Error('Empty command!'), app);
        return;
      }

    // start child process
    exec(cfg.command, cfg.options).then(function (result) {
      debug('Command completed.');

      // Send output
      var stdout = result.stdout;
      var stderr = result.stderr;

      stdout.on('data', function (d) {
        console.log(d.toString());
      });
      stderr.on('data', function (d) {
        console.log(d.toString());
      });

      self.emit('child-closed', app, stderr, stdout);
    }).fail(function (err) {
      debug(err);
      self.emit('child-error', err, app);
      // app.quit();
    }).progress(function (childProcess) {
      debug('Command started. [PID: ' + childProcess.pid + ']');
      self.emit('child-started', childProcess);

      start(cfg, app, childProcess, debug);
    });
  });
}

// Inherit functions from `EventEmitter`'s prototype
util.inherits(electronify, EventEmitter);

module.exports = function (cfg) {
  return new electronify(cfg);
};

function start(cfg, app, childProcess, debug) {
  app.on('quit', function () {
    if (childProcess && !childProcess.killed) childProcess.kill();
  });

  // setup window config
  var browserConfig = cfg.window || DEFAULT_WINDOW;
  browserConfig.show = false;

  // create window
  var window = new BrowserWindow(browserConfig);

  // call pre load handler
  // menus could be created in this function
  // window and app event handlers could also be added here
  if (cfg.preLoad) cfg.preLoad(app, window);

  // load url
  window.loadURL(cfg.url);

  window.webContents.on('did-finish-load', function () {
    debug('Finished loading.');

    // call post load handler
    if (cfg.postLoad) cfg.postLoad(app, window);

    if (!cfg.show === false) {
      window.show();
    }
  });

  // Clean resource
  window.on('closed', function () {
    debug('Window closed.');
    window = null;
  });

  // Enable dev tools
  if (cfg.showDevTools) window.openDevTools();
}