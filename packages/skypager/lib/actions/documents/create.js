'use strict';

var _arguments = arguments;
Object.defineProperty(exports, "__esModule", {
  value: true
});
action('Create Document');

execute(function () {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  console.log('Create a document', undefined, _arguments);
});

var config = exports.config = {
  params: {
    id: { type: 'string' },
    metadata: { type: 'object' },
    title: { type: 'string' }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hY3Rpb25zL2RvY3VtZW50cy9jcmVhdGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUE7O0FBRXpCLE9BQU8sQ0FBQyxZQUFpQjtNQUFoQixNQUFNLHlEQUFHLEVBQUU7O0FBQ2xCLFNBQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLHdCQUFrQixDQUFBO0NBQ2xELENBQUMsQ0FBQTs7QUFFSyxJQUFNLE1BQU0sV0FBTixNQUFNLEdBQUc7QUFDcEIsUUFBTSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUN0QixZQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzVCLFNBQUssRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUU7R0FDMUI7Q0FDRixDQUFBIiwiZmlsZSI6ImNyZWF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFjdGlvbignQ3JlYXRlIERvY3VtZW50JylcblxuZXhlY3V0ZSgocGFyYW1zID0ge30pID0+IHtcbiAgY29uc29sZS5sb2coJ0NyZWF0ZSBhIGRvY3VtZW50JywgdGhpcywgYXJndW1lbnRzKVxufSlcblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgcGFyYW1zOiB7XG4gICAgaWQ6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICBtZXRhZGF0YTogeyB0eXBlOiAnb2JqZWN0JyB9LFxuICAgIHRpdGxlOiB7IHR5cGU6ICdzdHJpbmcnIH1cbiAgfVxufVxuIl19