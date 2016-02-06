'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Describe a model accepts a description of a model, and a function body
* which is called with certain global properties available to use as a chainable DSL
* that can be used to describe the structure of an entities underlying documents
* or data sources
*
* The first argument to the function is the model definition object itself.  This
* is a flexible structure which lets you express facts about documents and datasources
* which are parsed in order to provide an instance of this Model AKA an Entity, with its attributes
* and methods.
*/

describe("Spec", function (model) {
  var spec = model,
      specs = model;

  /*
  specs.have.attributes(function(){
    string('title')
    status('in_progress','passing','failing')
  })
  */

  spec.documents.have.a.section('Specifications', function (section) {
    section.has.many.articles('Examples', function (example, i) {
      example.builder = builders.example;
    });

    section.builder = builders.specifications;
  });
});

function create(_ref) {
  var document = _ref.document;
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _assign2.default)({}, document.data, {
    specifications: document.specifications
  });
}

function validate(document, spec, util) {
  return true;
}

var builders = {
  specifications: function specifications(section) {
    var base = {
      title: section.value,
      getNode: function getNode() {
        return section;
      },
      runTests: function runTests() {
        return section.examples.map(function (example, index) {
          return [example.runTests(), example];
        });
      }
    };

    Object.defineProperty(base, 'examples', {
      configurable: true,
      get: function get() {
        return section.examples;
      }
    });

    return base;
  },
  example: function example(_example, index) {
    return {
      title: _example.value,
      getNode: function getNode() {
        return _example;
      },
      index: index,
      codeBlocks: (_example.codeBlocks || []).pluck('value'),
      runTests: function runTests(options) {
        var locals = { options: options, document: _example.document, section: _example.parent, article: _example };

        return _example.codeBlocks.map(function (codeBlock) {
          locals.codeBlock = codeBlock;

          return util.runWithLocals(function () {
            eval(codeBlock.value);
          }, locals);
        });
      }
    };
  }
};

module.exports = {
  create: create,
  validate: validate,
  builders: builders,
  config: {
    attributes: {
      title: {
        type: 'string',
        sources: ['metadata.title', 'headings.titles.0']
      }
    }
  }
};