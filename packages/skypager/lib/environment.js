'use strict';

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function environment(pwd) {
  pwd = pwd || process.env.PWD;

  if (require('fs').existsSync(pwd + '/.env')) {
    _dotenv2.default.load(pwd + '/.env');
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lbnZpcm9ubWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxXQUFXLENBQUUsR0FBRyxFQUFFO0FBQzFDLEtBQUcsR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUE7O0FBRTVCLE1BQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEVBQUU7QUFDM0MscUJBQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQTtHQUMzQjtDQUNGLENBQUEiLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlbnZpcm9ubWVudCAocHdkKSB7XG4gIHB3ZCA9IHB3ZCB8fCBwcm9jZXNzLmVudi5QV0RcblxuICBpZiAocmVxdWlyZSgnZnMnKS5leGlzdHNTeW5jKHB3ZCArICcvLmVudicpKSB7XG4gICAgZG90ZW52LmxvYWQocHdkICsgJy8uZW52JylcbiAgfVxufVxuXG4iXX0=