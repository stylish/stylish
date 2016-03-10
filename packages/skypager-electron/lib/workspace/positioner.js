'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Positioner = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Positioner = exports.Positioner = (function () {
  function Positioner(browserWindow, screen, setBounds) {
    (0, _classCallCheck3.default)(this, Positioner);

    this.browserWindow = browserWindow;
    this.electronScreen = screen;

    if (setBounds) {
      browserWindow.setBounds(setBounds);
    }
  }

  (0, _createClass3.default)(Positioner, [{
    key: '_getCoords',
    value: function _getCoords() {
      var position = arguments.length <= 0 || arguments[0] === undefined ? 'center' : arguments[0];
      var trayPosition = arguments[1];

      var screenSize = this._getScreenSize();
      var windowSize = this._getWindowSize();

      if (trayPosition === undefined) trayPosition = {};

      // Positions
      var positions = {
        trayLeft: {
          x: Math.floor(trayPosition.x),
          y: screenSize.y
        },
        trayBottomLeft: {
          x: Math.floor(trayPosition.x),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        trayRight: {
          x: Math.floor(trayPosition.x - windowSize[0] + trayPosition.width),
          y: screenSize.y
        },
        trayBottomRight: {
          x: Math.floor(trayPosition.x - windowSize[0] + trayPosition.width),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        trayCenter: {
          x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
          y: screenSize.y
        },
        trayBottomCenter: {
          x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        topLeft: {
          x: screenSize.x,
          y: screenSize.y
        },
        topRight: {
          x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
          y: screenSize.y
        },
        bottomLeft: {
          x: screenSize.x,
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        bottomRight: {
          x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        topCenter: {
          x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
          y: screenSize.y
        },
        bottomCenter: {
          x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
          y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
        },
        center: {
          x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
          y: Math.floor((screenSize.height + screenSize.y) / 2 - windowSize[1] / 2)
        }
      };

      // Default to right if the window is bigger than the space left.
      // Because on Windows the window might get out of bounds and dissappear.
      if (position.substr(0, 4) === 'tray') {
        if (positions[position].x + windowSize[0] > screenSize.width + screenSize.x) {
          return {
            x: positions['topRight'].x,
            y: positions[position].y
          };
        }
      }

      return positions[position];
    }
  }, {
    key: '_getWindowSize',
    value: function _getWindowSize() {
      return this.browserWindow.getSize();
    }
  }, {
    key: '_getScreenSize',
    value: function _getScreenSize() {
      return this.electronScreen.getDisplayNearestPoint(this.electronScreen.getCursorScreenPoint()).workArea;
    }
  }, {
    key: 'move',
    value: function move(position, trayPos) {
      // Get positions coords
      var coords = this._getCoords(position, trayPos);

      // Set the windows position
      this.browserWindow.setPosition(coords.x, coords.y);
    }
  }, {
    key: 'calculate',
    value: function calculate(position, trayPos) {
      // Get positions coords
      var coords = this._getCoords(position, trayPos);

      return {
        x: coords.x,
        y: coords.y
      };
    }
  }]);
  return Positioner;
})();

exports.default = Positioner;