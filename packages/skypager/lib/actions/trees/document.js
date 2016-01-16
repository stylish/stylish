'use strict';

action('Document Tree');

/* Takes a tree of assets - say source code files - and
 * generates a document from them. */
execute(function (params) {
  var project = undefined;
  var paths = {};

  console.log("Params", params);
});

exports.config = {
  params: {
    base: {
      desc: 'The tree you want to clone into the documents folder',
      type: 'relative'
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL3RyZWVzL2RvY3VtZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxDQUFDLGVBQWUsQ0FBQzs7OztBQUFBLEFBSXZCLE9BQU8sQ0FBQyxVQUFDLE1BQU0sRUFBSztBQUNsQixNQUFJLE9BQU8sWUFBTyxDQUFBO0FBQ2xCLE1BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQTs7QUFFZCxTQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQTtDQUM5QixDQUFDLENBQUE7O0FBRUYsT0FBTyxDQUFDLE1BQU0sR0FBRztBQUNmLFFBQU0sRUFBRTtBQUNOLFFBQUksRUFBRTtBQUNKLFVBQUksRUFBRSxzREFBc0Q7QUFDNUQsVUFBSSxFQUFFLFVBQVU7S0FDakI7R0FDRjtDQUNGLENBQUEiLCJmaWxlIjoiZG9jdW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhY3Rpb24oJ0RvY3VtZW50IFRyZWUnKVxuXG4vKiBUYWtlcyBhIHRyZWUgb2YgYXNzZXRzIC0gc2F5IHNvdXJjZSBjb2RlIGZpbGVzIC0gYW5kXG4gKiBnZW5lcmF0ZXMgYSBkb2N1bWVudCBmcm9tIHRoZW0uICovXG5leGVjdXRlKChwYXJhbXMpID0+IHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBwYXRocyA9IHt9XG5cbiAgY29uc29sZS5sb2coXCJQYXJhbXNcIiwgcGFyYW1zKVxufSlcblxuZXhwb3J0cy5jb25maWcgPSB7XG4gIHBhcmFtczoge1xuICAgIGJhc2U6IHtcbiAgICAgIGRlc2M6ICdUaGUgdHJlZSB5b3Ugd2FudCB0byBjbG9uZSBpbnRvIHRoZSBkb2N1bWVudHMgZm9sZGVyJyxcbiAgICAgIHR5cGU6ICdyZWxhdGl2ZSdcbiAgICB9XG4gIH1cbn1cbiJdfQ==