'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.validate = validate;
define('Page', function (page) {});

function create(_ref) {
  var document = _ref.document;
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('value'),
    subsections: document.headings.articles.pluck('value'),
    html: document.html.content
  };
}

function validate(document, spec, utils) {
  return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvcGFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUVnQixNQUFNLEdBQU4sTUFBTTtRQVVOLFFBQVEsR0FBUixRQUFRO0FBWnhCLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBQyxJQUFJLEVBQUssRUFBRyxDQUFDLENBQUE7O0FBRXRCLFNBQVMsTUFBTSxPQUE4QjtNQUExQixRQUFRLFFBQVIsUUFBUTtNQUFJLE9BQU8seURBQUcsRUFBRTs7QUFDaEQsU0FBTztBQUNMLFFBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtBQUNuQixVQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsWUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDbkQsZUFBVyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDdEQsUUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTztHQUM1QixDQUFBO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLENBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDL0MsU0FBTyxJQUFJLENBQUE7Q0FDWiIsImZpbGUiOiJwYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCdQYWdlJywgKHBhZ2UpID0+IHsgfSlcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSAoeyBkb2N1bWVudCB9LCBjb250ZXh0ID0ge30pIHtcbiAgcmV0dXJuIHtcbiAgICBkYXRhOiBkb2N1bWVudC5kYXRhLFxuICAgIHBhcnNlZDogZG9jdW1lbnQucGFyc2VkLFxuICAgIHNlY3Rpb25zOiBkb2N1bWVudC5oZWFkaW5ncy5zZWN0aW9ucy5wbHVjaygndmFsdWUnKSxcbiAgICBzdWJzZWN0aW9uczogZG9jdW1lbnQuaGVhZGluZ3MuYXJ0aWNsZXMucGx1Y2soJ3ZhbHVlJyksXG4gICAgaHRtbDogZG9jdW1lbnQuaHRtbC5jb250ZW50XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlIChkb2N1bWVudCwgc3BlYywgdXRpbHMpIHtcbiAgcmV0dXJuIHRydWVcbn1cbiJdfQ==