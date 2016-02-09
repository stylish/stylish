'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * In the Model Definition DSL it is possible to define the structure
 * of the document and supply functions which can be used to shape
 * the document into a JSON object.
 *
 */
module.exports = function (document) {
  var Interface = {};
  var definition = document.modelClass && document.modelClass.definition;

  var ast = document.indexed;

  ast.children.forEach(function (node) {
    if (node.type === 'heading') {
      (0, _util.assign)(node, {
        extract: function extract() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return extractContent.apply(undefined, [node].concat(args));
        }
      });
    }
  });

  (0, _keys2.default)(definition.sectionsConfig).forEach(function (sectionId) {
    var sectionConfig = definition.sectionsConfig[sectionId];

    if (sectionConfig.builder && sectionConfig.builderType === 'builder') {
      (0, _util.lazy)(Interface, sectionId, function () {
        var section = document.nodes.at.id(sectionConfig.slug);
        var built = sectionConfig.builder(section) || {};

        if (!isEmpty(sectionConfig.config.articles)) {
          (0, _keys2.default)(sectionConfig.config.articles).forEach(function (articleId) {
            var articleConfig = sectionConfig.config.articles[articleId];

            if (articleConfig.builder && articleConfig.builderType === 'map') {
              (0, _util.lazy)(built, articleId, function () {
                return section && section.childHeadings.map(articleConfig.builder);
              }, false);
            }
          });
        }

        return built;
      }, false);
    }
  });

  Interface.toJSON = function () {
    var obj = {};

    (0, _keys2.default)(definition.sectionsConfig).forEach(function (sectionId) {
      obj[sectionId] = {};

      var sectionConfig = definition.sectionsConfig[sectionId];
      var section = document.nodes.at.id(sectionConfig.slug);

      if (sectionConfig.builder && sectionConfig.builderType === 'builder') {
        if (!isEmpty(sectionConfig.config.articles)) {
          (0, _keys2.default)(sectionConfig.config.articles).forEach(function (articleId) {
            var articleConfig = sectionConfig.config.articles[articleId];
            if (articleConfig.builder && articleConfig.builderType === 'map') {
              obj[sectionId][articleId] = obj[sectionId][articleId] || section && section.childHeadings.map(articleConfig.builder);
            }
          });
        }
      }
    });

    return obj;
  };

  return Interface;
};

function extractContent(node, extractionType) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  if (extractionType === 'paragraphs') {
    return 'TODO!';
  }
}

function isEmpty(obj) {
  return !obj || (0, _keys2.default)(obj).length === 0;
}