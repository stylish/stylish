'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewDefinition = undefined;
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

var ViewDefinition = exports.ViewDefinition = (function () {
  function ViewDefinition(name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { type: type } : arguments[1];

    _classCallCheck(this, ViewDefinition);

    this.name = name;
    this.options = options;
    this.type = type;
  }

  _createClass(ViewDefinition, [{
    key: 'toReactComponent',
    value: function toReactComponent() {}
  }]);

  return ViewDefinition;
})();

ViewDefinition.current = current;
ViewDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  return (0, _util.noConflict)(fn, DSL)();
}

function lookup(viewName) {
  return tracker[_curr = tabelize((0, _util.parameterize)(viewName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  layout: function layout(viewName) {
    tracker[_curr = tabelize((0, _util.parameterize)(viewName)).toLowerCase()] = new ViewDefinition(viewName, fn);
  },
  page: function page(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'page' });
  },
  view: function view(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'component' });
  },
  component: function component(viewName) {
    tracker[_curr = viewName] = new ViewDefinition(viewName, { type: 'component' });
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUF1QmdCLEdBQUcsR0FBSCxHQUFHO1FBSUgsTUFBTSxHQUFOLE1BQU07Ozs7OztBQXpCdEIsSUFBSSxPQUFPLEdBQUcsRUFBRyxDQUFBO0FBQ2pCLElBQUksS0FBSyxZQUFBLENBQUE7O0FBRVQsU0FBUyxPQUFPLEdBQUk7QUFBRSxTQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUFFO0FBQzdDLFNBQVMsZUFBZSxHQUFJO0FBQUUsT0FBSyxHQUFHLElBQUksQ0FBQyxBQUFDLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7O0lBRXRELGNBQWMsV0FBZCxjQUFjO0FBQ3pCLFdBRFcsY0FBYyxDQUNaLElBQUksRUFBb0I7UUFBbEIsT0FBTyx5REFBRyxFQUFDLElBQUksRUFBSixJQUFJLEVBQUM7OzBCQUR4QixjQUFjOztBQUV2QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtBQUNoQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtBQUN0QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtHQUNqQjs7ZUFMVSxjQUFjOzt1Q0FPTCxFQUVuQjs7O1NBVFUsY0FBYzs7O0FBWTNCLGNBQWMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO0FBQ2hDLGNBQWMsQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFBOztBQUV6QyxTQUFTLEdBQUcsQ0FBRSxFQUFFLEVBQUU7QUFDdkIsU0FBTyxVQXhCYSxVQUFVLEVBd0JaLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFBO0NBQzdCOztBQUVNLFNBQVMsTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUMvQixTQUFPLE9BQU8sQ0FBRSxLQUFLLEdBQUcsUUFBUSxDQUFDLFVBNUJTLFlBQVksRUE0QlIsUUFBUSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBRSxDQUFBO0NBQ3pFOztBQUVELFVBL0JRLE1BQU0sRUErQlAsR0FBRyxFQUFFO0FBQ1YsUUFBTSxrQkFBRSxRQUFRLEVBQUU7QUFDaEIsV0FBTyxDQUFFLEtBQUssR0FBRyxRQUFRLENBQUMsVUFqQ2MsWUFBWSxFQWlDYixRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFFLEdBQUcsSUFBSSxjQUFjLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0dBQ3JHO0FBRUQsTUFBSSxnQkFBRSxRQUFRLEVBQUU7QUFDZCxXQUFPLENBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBRSxHQUFHLElBQUksY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO0dBQzNFO0FBRUQsTUFBSSxnQkFBRSxRQUFRLEVBQUU7QUFDZCxXQUFPLENBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBRSxHQUFHLElBQUksY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFBO0dBQ2hGO0FBRUQsV0FBUyxxQkFBRSxRQUFRLEVBQUU7QUFDbkIsV0FBTyxDQUFFLEtBQUssR0FBRyxRQUFRLENBQUUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQTtHQUMvRTtDQUNGLENBQUMsQ0FBQSIsImZpbGUiOiJ2aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NpZ24sIGhpZGUsIG5vQ29uZmxpY3QsIHRhYmxlaXplLCBwYXJhbWV0ZXJpemUsIHNpbmd1bGFyaXplLCB1bmRlcnNjb3JlfSBmcm9tICcuLi8uLi91dGlsJ1xuXG5sZXQgdHJhY2tlciA9IHsgfVxubGV0IF9jdXJyXG5cbmZ1bmN0aW9uIGN1cnJlbnQgKCkgeyByZXR1cm4gdHJhY2tlcltfY3Vycl0gfVxuZnVuY3Rpb24gY2xlYXJEZWZpbml0aW9uICgpIHsgX2N1cnIgPSBudWxsOyBkZWxldGUgdHJhY2tlcltfY3Vycl0gfVxuXG5leHBvcnQgY2xhc3MgVmlld0RlZmluaXRpb24ge1xuICBjb25zdHJ1Y3RvciAobmFtZSwgb3B0aW9ucyA9IHt0eXBlfSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICB9XG5cbiAgdG9SZWFjdENvbXBvbmVudCAoKSB7XG5cbiAgfVxufVxuXG5WaWV3RGVmaW5pdGlvbi5jdXJyZW50ID0gY3VycmVudFxuVmlld0RlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uID0gY2xlYXJEZWZpbml0aW9uXG5cbmV4cG9ydCBmdW5jdGlvbiBEU0wgKGZuKSB7XG4gIHJldHVybiBub0NvbmZsaWN0KGZuLCBEU0wpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2t1cCh2aWV3TmFtZSkge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUodmlld05hbWUpKS50b0xvd2VyQ2FzZSgpKV1cbn1cblxuYXNzaWduKERTTCwge1xuICBsYXlvdXQgKHZpZXdOYW1lKSB7XG4gICAgdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUodmlld05hbWUpKS50b0xvd2VyQ2FzZSgpKV0gPSBuZXcgVmlld0RlZmluaXRpb24odmlld05hbWUsIGZuKVxuICB9LFxuXG4gIHBhZ2UgKHZpZXdOYW1lKSB7XG4gICAgdHJhY2tlclsoX2N1cnIgPSB2aWV3TmFtZSldID0gbmV3IFZpZXdEZWZpbml0aW9uKHZpZXdOYW1lLCB7dHlwZTogJ3BhZ2UnfSlcbiAgfSxcblxuICB2aWV3ICh2aWV3TmFtZSkge1xuICAgIHRyYWNrZXJbKF9jdXJyID0gdmlld05hbWUpXSA9IG5ldyBWaWV3RGVmaW5pdGlvbih2aWV3TmFtZSwge3R5cGU6ICdjb21wb25lbnQnfSlcbiAgfSxcblxuICBjb21wb25lbnQgKHZpZXdOYW1lKSB7XG4gICAgdHJhY2tlclsoX2N1cnIgPSB2aWV3TmFtZSldID0gbmV3IFZpZXdEZWZpbml0aW9uKHZpZXdOYW1lLCB7dHlwZTonY29tcG9uZW50J30pXG4gIH1cbn0pXG4iXX0=