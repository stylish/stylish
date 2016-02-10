'use strict';

var _layouts = require('./layouts');

var Layouts = _interopRequireWildcard(_layouts);

var _containers = require('./containers');

var Containers = _interopRequireWildcard(_containers);

var _components = require('./components');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

module.exports = {
  Components: {
    Icon: _components.Icon,
    HTMLSafe: _components.HTMLSafe
  },
  Containers: Containers,
  Layouts: Layouts
};