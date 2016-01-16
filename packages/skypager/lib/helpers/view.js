'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _view = require('./definitions/view');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var View = (function (_Helper) {
  _inherits(View, _Helper);

  function View() {
    _classCallCheck(this, View);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(View).apply(this, arguments));
  }

  _createClass(View, null, [{
    key: 'fromDefinition',
    value: function fromDefinition(uri, md) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.api = md.api;
      options.definition = md;

      return new View(uri, options);
    }
  }]);

  return View;
})(_helper2.default);

View.DSL = _view.DSL;
View.Definition = _view.ViewDefinition;

module.exports = View;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBR00sSUFBSTtZQUFKLElBQUk7O1dBQUosSUFBSTswQkFBSixJQUFJOztrRUFBSixJQUFJOzs7ZUFBSixJQUFJOzttQ0FDZSxHQUFHLEVBQUUsRUFBRSxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDMUMsYUFBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFBO0FBQ3BCLGFBQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFBOztBQUV2QixhQUFPLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUM5Qjs7O1NBTkcsSUFBSTs7O0FBU1YsSUFBSSxDQUFDLEdBQUcsU0FYQyxHQUFHLEFBV0UsQ0FBQTtBQUNkLElBQUksQ0FBQyxVQUFVLFNBWkQsY0FBYyxBQVlJLENBQUE7O0FBRWhDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBIiwiZmlsZSI6InZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IHsgRFNMLCBWaWV3RGVmaW5pdGlvbiB9IGZyb20gJy4vZGVmaW5pdGlvbnMvdmlldydcblxuY2xhc3MgVmlldyBleHRlbmRzIEhlbHBlciB7XG4gIHN0YXRpYyBmcm9tRGVmaW5pdGlvbiAodXJpLCBtZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucy5hcGkgPSBtZC5hcGlcbiAgICBvcHRpb25zLmRlZmluaXRpb24gPSBtZFxuXG4gICAgcmV0dXJuIG5ldyBWaWV3KHVyaSwgb3B0aW9ucylcbiAgfVxufVxuXG5WaWV3LkRTTCA9IERTTFxuVmlldy5EZWZpbml0aW9uID0gVmlld0RlZmluaXRpb25cblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4iXX0=