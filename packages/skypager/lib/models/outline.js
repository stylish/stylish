'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.validate = validate;
define('Outline', function () {});

function create(document) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('title'),
    subsections: document.headings.articles.pluck('title'),
    html: document.html.content
  };
}

function validate(document, spec, utils) {
  return true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvb3V0bGluZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUlnQixNQUFNLEdBQU4sTUFBTTtRQVVOLFFBQVEsR0FBUixRQUFRO0FBZHhCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsWUFBTSxFQUV2QixDQUFDLENBQUE7O0FBRUssU0FBUyxNQUFNLENBQUUsUUFBUSxFQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDNUMsU0FBTztBQUNMLFFBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtBQUNuQixVQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU07QUFDdkIsWUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDbkQsZUFBVyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDdEQsUUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTztHQUM1QixDQUFBO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLENBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDL0MsU0FBTyxJQUFJLENBQUE7Q0FDWiIsImZpbGUiOiJvdXRsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKCdPdXRsaW5lJywgKCkgPT4ge1xuXG59KVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlIChkb2N1bWVudCwgb3B0aW9ucyA9IHt9KSB7XG4gIHJldHVybiB7XG4gICAgZGF0YTogZG9jdW1lbnQuZGF0YSxcbiAgICBwYXJzZWQ6IGRvY3VtZW50LnBhcnNlZCxcbiAgICBzZWN0aW9uczogZG9jdW1lbnQuaGVhZGluZ3Muc2VjdGlvbnMucGx1Y2soJ3RpdGxlJyksXG4gICAgc3Vic2VjdGlvbnM6IGRvY3VtZW50LmhlYWRpbmdzLmFydGljbGVzLnBsdWNrKCd0aXRsZScpLFxuICAgIGh0bWw6IGRvY3VtZW50Lmh0bWwuY29udGVudFxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZSAoZG9jdW1lbnQsIHNwZWMsIHV0aWxzKSB7XG4gIHJldHVybiB0cnVlXG59XG4iXX0=