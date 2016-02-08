'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constrain = constrain;
exports.calculateBounds = calculateBounds;
exports.calculateSizes = calculateSizes;
exports.topPos = topPos;
exports.leftPos = leftPos;
exports.calculatePosition = calculatePosition;
exports.size = size;

var _lodash = require('lodash');

function constrain(settings, bounds) {
  return assign(calculateBounds(settings, bounds), { bounds: bounds });
}

exports.default = constrain;
function calculateBounds() {
  var inputs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var bounds = arguments[1];

  inputs = assign({}, inputs, calculateSizes(inputs, bounds));

  var outputs = assign(inputs, calculatePosition(inputs, bounds));

  return _extends({}, outputs, {
    x: outputs.left,
    y: outputs.top
  });
}

function calculateSizes(settings, screen) {
  settings.height = size(settings.height, screen.height, 'height');
  settings.width = size(settings.width, screen.width, 'width');

  return settings;
}

function topPos(v, limit) {
  if (v.top && (0, _lodash.isString)(v.top)) {
    v.top = size(v.top, limit, 'top');
  }

  if (v.bottom && (0, _lodash.isString)(v.bottom)) {
    v.bottom = size(v.bottom, limit, 'bottom');
  }

  if (v.bottom) {
    v.top = limit - v.bottom - v.height;
    delete v.bottom;
  }

  return v.top || 0;
}

function leftPos(v, limit) {
  if (v.left && (0, _lodash.isString)(v.left)) {
    v.left = size(v.left, limit, 'left');
  }

  if (v.right && (0, _lodash.isString)(v.right)) {
    v.right = size(v.right, limit, 'right');
  }

  if (v.right) {
    v.left = limit - v.right - v.width;
    delete v.right;
  }

  return v.left || 0;
}

function calculatePosition(settings, screen) {
  settings.top = topPos(settings, screen.height);
  settings.left = leftPos(settings, screen.width);

  return (0, _lodash.pick)(settings, 'top', 'left');
}

function size(value, limit, m) {
  var result = undefined;

  if ((0, _lodash.isString)(value) && value.match(/\%/)) {
    result = value.replace(/\%/, '');
    result = parseInt(result);
    result = result / 100 * parseInt(limit);
  } else {
    result = parseInt(value);
  }

  return result;
}

function applyLayout(layoutName, settings, screen) {

  switch (layoutName) {
    case 'docked-right':
      break;

    case 'centered':
      return {
        centered: true
      };

    default:
      return {
        height: screen.height * 0.8,
        width: screen.width * 0.8,
        centered: true
      };
  }
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var values = _Object.values;