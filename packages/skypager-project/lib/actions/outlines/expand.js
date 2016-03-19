'use strict';

action('expand outline');

execute(function () {
  var params = arguments.length <= 0 || arguments[0] === undefined ? { id: id } : arguments[0];
  var _ref = arguments[1];
  var project = _ref.project;

  var doc = project.docs.findBy({
    type: 'outline',
    id: id
  });

  console.log(doc.toEntity());
});