"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidUser = isValidUser;
exports.canPerformAction = canPerformAction;
function isValidUser(connectionData, authData, project) {
  return true;
}

function canPerformAction(user) {
  var message = arguments.length <= 1 || arguments[1] === undefined ? { topic: topic, action: action, data: data } : arguments[1];
  var project = arguments[2];

  return true;
}