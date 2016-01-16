'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContextDefiniton = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tracker = {};
var _curr = undefined;

function current() {
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

var ContextDefiniton = exports.ContextDefiniton = (function () {
  function ContextDefiniton(contextName) {
    _classCallCheck(this, ContextDefiniton);

    this.name = contextName;
    this.config = {};
    this.version = '0.0.1';
    this.generator = function () {
      return {};
    };
  }

  _createClass(ContextDefiniton, [{
    key: 'create',
    value: function create() {
      return {
        data: this.generator
      };
    }
  }, {
    key: 'api',
    get: function get() {
      return {
        name: this.name,
        generator: this.generator,
        create: function create() {
          return this.create.apply(this, arguments);
        }
      };
    }
  }]);

  return ContextDefiniton;
})();

ContextDefinition.current = current;
ContextDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(contextName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(contextName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  context: function context(contextName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(contextName))] = new ContextDefinition(contextName);
  },
  generate: function generate() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).generate.apply(_tracker$_curr, arguments);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL2NvbnRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFvQ2dCLEdBQUcsR0FBSCxHQUFHO1FBSUgsTUFBTSxHQUFOLE1BQU07Ozs7OztBQXRDdEIsSUFBSSxPQUFPLEdBQUcsRUFBRyxDQUFBO0FBQ2pCLElBQUksS0FBSyxZQUFBLENBQUE7O0FBRVQsU0FBUyxPQUFPLEdBQUk7QUFBRSxTQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUFFO0FBQzdDLFNBQVMsZUFBZSxHQUFJO0FBQUUsT0FBSyxHQUFHLElBQUksQ0FBQyxBQUFDLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7O0lBRXRELGdCQUFnQixXQUFoQixnQkFBZ0I7QUFDM0IsV0FEVyxnQkFBZ0IsQ0FDZCxXQUFXLEVBQUU7MEJBRGYsZ0JBQWdCOztBQUV6QixRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtBQUN2QixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUcsQ0FBQTtBQUNqQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsU0FBUyxHQUFJO2FBQU8sRUFBRTtLQUFDLEFBQUMsQ0FBQTtHQUM5Qjs7ZUFOVSxnQkFBZ0I7OzZCQWtCakI7QUFDUixhQUFPO0FBQ0wsWUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTO09BQ3JCLENBQUE7S0FDRjs7O3dCQWRVO0FBQ1QsYUFBTztBQUNMLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLGlCQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDekIsY0FBTSxvQkFBVztBQUNmLGlCQUFPLElBQUksQ0FBQyxNQUFNLE1BQUEsQ0FBWCxJQUFJLFlBQWdCLENBQUE7U0FDNUI7T0FDRixDQUFBO0tBQ0Y7OztTQWhCVSxnQkFBZ0I7OztBQXlCN0IsaUJBQWlCLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUNuQyxpQkFBaUIsQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBOztBQUU1QyxTQUFTLEdBQUcsQ0FBRSxFQUFFLEVBQUU7QUFDdkIsWUFyQ2MsVUFBVSxFQXFDYixFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQTtDQUN0Qjs7QUFFTSxTQUFTLE1BQU0sQ0FBQyxXQUFXLEVBQUU7QUFDbEMsU0FBTyxPQUFPLENBQUUsS0FBSyxHQUFHLFVBekNFLFFBQVEsRUF5Q0QsVUF6Q0csWUFBWSxFQXlDRixXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFFLENBQUE7Q0FDNUU7O0FBRUQsVUE1Q1EsTUFBTSxFQTRDUCxHQUFHLEVBQUU7QUFDVixTQUFPLEVBQUUsaUJBQVUsV0FBVyxFQUFFO0FBQzlCLFdBQU8sQ0FBRSxLQUFLLEdBQUcsVUE5Q08sUUFBUSxFQThDTixVQTlDUSxZQUFZLEVBOENQLFdBQVcsQ0FBQyxDQUFDLENBQUUsR0FBRyxJQUFJLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFBO0dBQzVGO0FBQ0QsVUFBUSxFQUFFLG9CQUFtQjs7O0FBQUUsc0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDLFFBQVEsTUFBQSwyQkFBUyxDQUFBO0dBQUU7Q0FDbEUsQ0FBQyxDQUFBIiwiZmlsZSI6ImNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2lnbiwgbm9Db25mbGljdCwgdGFiZWxpemUsIHBhcmFtZXRlcml6ZSwgc2luZ3VsYXJpemUsIHVuZGVyc2NvcmV9IGZyb20gJy4uLy4uL3V0aWwnXG5cbmxldCB0cmFja2VyID0geyB9XG5sZXQgX2N1cnJcblxuZnVuY3Rpb24gY3VycmVudCAoKSB7IHJldHVybiB0cmFja2VyW19jdXJyXSB9XG5mdW5jdGlvbiBjbGVhckRlZmluaXRpb24gKCkgeyBfY3VyciA9IG51bGw7IGRlbGV0ZSB0cmFja2VyW19jdXJyXSB9XG5cbmV4cG9ydCBjbGFzcyBDb250ZXh0RGVmaW5pdG9uIHtcbiAgY29uc3RydWN0b3IgKGNvbnRleHROYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gY29udGV4dE5hbWVcbiAgICB0aGlzLmNvbmZpZyA9IHsgfVxuICAgIHRoaXMudmVyc2lvbiA9ICcwLjAuMSdcbiAgICB0aGlzLmdlbmVyYXRvciA9ICgoKSA9PiAoe30pKVxuICB9XG5cbiAgZ2V0IGFwaSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZSxcbiAgICAgIGdlbmVyYXRvcjogdGhpcy5nZW5lcmF0b3IsXG4gICAgICBjcmVhdGUgKC4uLmFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlKC4uLmFyZ3MpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY3JlYXRlICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZGF0YTogdGhpcy5nZW5lcmF0b3JcbiAgICB9XG4gIH1cbn1cblxuQ29udGV4dERlZmluaXRpb24uY3VycmVudCA9IGN1cnJlbnRcbkNvbnRleHREZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbiA9IGNsZWFyRGVmaW5pdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gRFNMIChmbikge1xuICBub0NvbmZsaWN0KGZuLCBEU0wpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2t1cChjb250ZXh0TmFtZSkge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUoY29udGV4dE5hbWUpKS50b0xvd2VyQ2FzZSgpKV1cbn1cblxuYXNzaWduKERTTCwge1xuICBjb250ZXh0OiBmdW5jdGlvbiAoY29udGV4dE5hbWUpIHtcbiAgICB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShjb250ZXh0TmFtZSkpKV0gPSBuZXcgQ29udGV4dERlZmluaXRpb24oY29udGV4dE5hbWUpXG4gIH0sXG4gIGdlbmVyYXRlOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5nZW5lcmF0ZSguLi5hcmdzKSB9XG59KVxuIl19