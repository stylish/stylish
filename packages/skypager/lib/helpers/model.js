'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _model = require('./definitions/model');

var _path = require('path');

var _util = require('../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Model = (function (_Helper) {
  _inherits(Model, _Helper);

  function Model() {
    var _Object$getPrototypeO;

    _classCallCheck(this, Model);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var _this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Model)).call.apply(_Object$getPrototypeO, [this].concat(args)));

    _this.entities = {};
    return _this;
  }

  _createClass(Model, [{
    key: 'config',
    get: function get() {
      return this.definition && this.definition.config || {};
    }
  }, {
    key: 'attributes',
    get: function get() {
      var base = this.required.attributes || {};
      return Object.assign(base, this.config.attributes || {});
    }
  }, {
    key: 'name',
    get: function get() {
      return this.definition && this.definition.name || this.id;
    }
  }], [{
    key: 'validate',
    value: function validate(instance) {
      return true;
    }
  }]);

  return Model;
})(_helper2.default);

Model.DSL = _model.DSL;
Model.Definition = _model.ModelDefinition;

module.exports = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFNTSxLQUFLO1lBQUwsS0FBSzs7QUFDVCxXQURJLEtBQUssR0FDYTs7OzBCQURsQixLQUFLOztzQ0FDTyxJQUFJO0FBQUosVUFBSTs7O2dHQURoQixLQUFLLG1EQUVFLElBQUk7O0FBRWIsVUFBSyxRQUFRLEdBQUcsRUFBRSxDQUFBOztHQUNuQjs7ZUFMRyxLQUFLOzt3QkFPSztBQUNaLGFBQU8sSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUE7S0FDdkQ7Ozt3QkFFZTtBQUNkLFVBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQTtBQUN6QyxhQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0tBQ3pEOzs7d0JBRVc7QUFDVixhQUFPLEFBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSyxJQUFJLENBQUMsRUFBRSxDQUFBO0tBQzVEOzs7NkJBRWdCLFFBQVEsRUFBRTtBQUN6QixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0F0QkcsS0FBSzs7O0FBeUJYLEtBQUssQ0FBQyxHQUFHLFVBOUJBLEdBQUcsQUE4QkcsQ0FBQTtBQUNmLEtBQUssQ0FBQyxVQUFVLFVBL0JGLGVBQWUsQUErQkssQ0FBQTs7QUFFbEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUEiLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGVscGVyIGZyb20gJy4vaGVscGVyJ1xuaW1wb3J0IHsgRFNMLCBNb2RlbERlZmluaXRpb24gfSBmcm9tICcuL2RlZmluaXRpb25zL21vZGVsJ1xuaW1wb3J0IHsgYmFzZW5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgeyBoaWRlIH0gZnJvbSAnLi4vdXRpbCdcblxuY2xhc3MgTW9kZWwgZXh0ZW5kcyBIZWxwZXIge1xuICBjb25zdHJ1Y3RvciAoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpXG5cbiAgICB0aGlzLmVudGl0aWVzID0ge31cbiAgfVxuXG4gIGdldCBjb25maWcgKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmluaXRpb24gJiYgdGhpcy5kZWZpbml0aW9uLmNvbmZpZyB8fCB7fVxuICB9XG5cbiAgZ2V0IGF0dHJpYnV0ZXMoKXtcbiAgICBsZXQgYmFzZSA9IHRoaXMucmVxdWlyZWQuYXR0cmlidXRlcyB8fCB7fVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGJhc2UsIHRoaXMuY29uZmlnLmF0dHJpYnV0ZXMgfHwge30pXG4gIH1cblxuICBnZXQgbmFtZSAoKSB7XG4gICAgcmV0dXJuICh0aGlzLmRlZmluaXRpb24gJiYgdGhpcy5kZWZpbml0aW9uLm5hbWUpIHx8IHRoaXMuaWRcbiAgfVxuXG4gIHN0YXRpYyB2YWxpZGF0ZSAoaW5zdGFuY2UpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9XG59XG5cbk1vZGVsLkRTTCA9IERTTFxuTW9kZWwuRGVmaW5pdGlvbiA9IE1vZGVsRGVmaW5pdGlvblxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4iXX0=