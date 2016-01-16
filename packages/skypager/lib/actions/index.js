'use strict';

var _action = require('../helpers/action');

var _action2 = _interopRequireDefault(_action);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actions = ['assets/load', 'assets/update', 'documents/create', 'documents/detect_entities', 'projects/publish', 'trees/document'];

module.exports = function loadActions(skypager) {
  actions.forEach(function (action) {
    registry.load(require.resolve('./' + action));
  });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLEdBQUcsQ0FBQyxhQUFhLEVBQUMsZUFBZSxFQUFDLGtCQUFrQixFQUFDLDJCQUEyQixFQUFDLGtCQUFrQixFQUFDLGdCQUFnQixDQUFDLENBQUE7O0FBRWxJLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxXQUFXLENBQUUsUUFBUSxFQUFFO0FBQy9DLFNBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQSxNQUFNLEVBQUk7QUFDeEIsWUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFBO0dBQzlDLENBQUMsQ0FBQTtDQUNILENBQUEiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aW9uIGZyb20gJy4uL2hlbHBlcnMvYWN0aW9uJ1xuXG5jb25zdCBhY3Rpb25zID0gWydhc3NldHMvbG9hZCcsJ2Fzc2V0cy91cGRhdGUnLCdkb2N1bWVudHMvY3JlYXRlJywnZG9jdW1lbnRzL2RldGVjdF9lbnRpdGllcycsJ3Byb2plY3RzL3B1Ymxpc2gnLCd0cmVlcy9kb2N1bWVudCddXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbG9hZEFjdGlvbnMgKHNreXBhZ2VyKSB7XG4gIGFjdGlvbnMuZm9yRWFjaChhY3Rpb24gPT4ge1xuICAgIHJlZ2lzdHJ5LmxvYWQocmVxdWlyZS5yZXNvbHZlKCcuLycgKyBhY3Rpb24pKVxuICB9KVxufVxuIl19