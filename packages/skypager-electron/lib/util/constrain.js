'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.constrain = constrain;
exports.calculateBounds = calculateBounds;
exports.calculateSizes = calculateSizes;
exports.topPos = topPos;
exports.leftPos = leftPos;
exports.calculatePosition = calculatePosition;
exports.size = size;

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function constrain(settings, bounds) {
  return assign(calculateBounds(settings, bounds), { bounds: bounds });
}

exports.default = constrain;
function calculateBounds() {
  var inputs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var bounds = arguments[1];

  inputs = assign({}, inputs, calculateSizes(inputs, bounds));

  var outputs = assign(inputs, calculatePosition(inputs, bounds));

  return (0, _extends3.default)({}, outputs, {
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

  return Math.floor(v.top || 0);
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

  return Math.floor(v.left || 0);
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

  return Math.floor(result);
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
        height: Math.floor(screen.height * 0.8),
        width: Math.floor(screen.width * 0.8),
        centered: true
      };
  }
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var values = _Object.values;