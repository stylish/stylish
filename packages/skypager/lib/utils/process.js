'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execSync = execSync;
function execSync(cmd) {
  return require('child_process').execSync(cmd, {
    encoding: 'utf8'
  }).trim();
}