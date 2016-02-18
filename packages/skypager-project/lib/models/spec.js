'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

function decorate(_ref, _ref2) {
  var document = _ref.document;
  var project = _ref2.project;

  var doc = document;

  (0, _assign2.default)(doc, {
    get specs() {
      return doc.content.toJSON().specifications;
    },
    toMochaSuite: function toMochaSuite() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var currentSpec = doc;

      require('mocha').setup((0, _extends3.default)({
        ui: 'bdd'
      }, options));

      return function () {
        describe(doc.title, function () {
          doc.specs.examples.forEach(function (example) {
            it(example.title, function () {
              example.runTests();
            });
          });
        });
      };
    }
  });
}

function create(_ref3) {
  var document = _ref3.document;
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var specifications = document.content.toJSON();

  return (0, _assign2.default)({}, document.data, {
    title: title,
    mainCopy: mainCopy,
    specifications: specifications
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