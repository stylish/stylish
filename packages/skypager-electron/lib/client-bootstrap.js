'use strict';

var _create = require('babel-runtime/core-js/object/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventEmitter = require('events').EventEmitter;
var ipc = require('electron').ipcRenderer;

function SkypagerClient() {
	EventEmitter.call(this);
	this.wallet = 0;
}
SkypagerClient.prototype = (0, _create2.default)(EventEmitter.prototype);
SkypagerClient.constructor = SkypagerClient;

SkypagerClient.prototype.log = console.log.bind(console);

SkypagerClient.prototype.getState = function () {
	return JSON.parse(require('remote').getGlobal('SkypagerElectronAppState'));
};

window.$skypager = new SkypagerClient();

ipc.on('skypager:message', function (event, params) {
	$skypager.emit('skypager:message', event, params);
	$skypager.log(arguments);
});