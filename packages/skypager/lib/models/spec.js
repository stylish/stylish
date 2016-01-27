'use strict';

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

  return Object.assign({}, document.data, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9tb2RlbHMvc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVlBLFFBQVEsQ0FBQyxNQUFNLEVBQUUsVUFBUyxLQUFLLEVBQUM7QUFDOUIsTUFBSSxJQUFJLEdBQUcsS0FBSztNQUFFLEtBQUssR0FBRyxLQUFLOzs7Ozs7Ozs7QUFBQyxBQVNoQyxNQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLFVBQVMsT0FBTyxFQUFDO0FBQy9ELFdBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsVUFBUyxPQUFPLEVBQUUsQ0FBQyxFQUFDO0FBQ3hELGFBQU8sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQTtLQUNuQyxDQUFDLENBQUE7O0FBRUYsV0FBTyxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFBO0dBQzFDLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQTs7QUFFRixTQUFTLE1BQU0sT0FBNEI7TUFBekIsUUFBUSxRQUFSLFFBQVE7TUFBSSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3hDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRTtBQUN0QyxrQkFBYyxFQUFFLFFBQVEsQ0FBQyxjQUFjO0dBQ3hDLENBQUMsQ0FBQTtDQUNIOztBQUVELFNBQVMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDO0FBQ3JDLFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0FBRUQsSUFBSSxRQUFRLEdBQUc7QUFDYixnQkFBYyxFQUFFLHdCQUFTLE9BQU8sRUFBQztBQUMvQixRQUFJLElBQUksR0FBRztBQUNULFdBQUssRUFBRSxPQUFPLENBQUMsS0FBSztBQUNwQixhQUFPLEVBQUUsbUJBQVU7QUFBRSxlQUFPLE9BQU8sQ0FBQTtPQUFFO0FBQ3JDLGNBQVEsRUFBRSxvQkFBVTtBQUNsQixlQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQVMsT0FBTyxFQUFFLEtBQUssRUFBQztBQUNsRCxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQTtTQUNyQyxDQUFDLENBQUE7T0FDSDtLQUNGLENBQUE7O0FBRUQsVUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQ3RDLGtCQUFZLEVBQUUsSUFBSTtBQUNsQixTQUFHLEVBQUUsZUFBVTtBQUNiLGVBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQTtPQUN4QjtLQUNGLENBQUMsQ0FBQTs7QUFFRixXQUFPLElBQUksQ0FBQTtHQUNaO0FBQ0QsU0FBTyxFQUFFLGlCQUFTLFFBQU8sRUFBRSxLQUFLLEVBQUM7QUFDL0IsV0FBTztBQUNMLFdBQUssRUFBRSxRQUFPLENBQUMsS0FBSztBQUNwQixhQUFPLEVBQUUsbUJBQVU7QUFBRSxlQUFPLFFBQU8sQ0FBQTtPQUFFO0FBQ3JDLFdBQUssRUFBRSxLQUFLO0FBQ1osZ0JBQVUsRUFBRSxDQUFDLFFBQU8sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFBLENBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUNyRCxjQUFRLEVBQUUsa0JBQVMsT0FBTyxFQUFDO0FBQ3pCLFlBQUksTUFBTSxHQUFHLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBTyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsUUFBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBTyxFQUFDLENBQUE7O0FBRXRHLGVBQU8sUUFBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBUyxTQUFTLEVBQUM7QUFDL0MsZ0JBQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBOztBQUU1QixpQkFBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVU7QUFDbEMsZ0JBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7V0FDdEIsRUFBRSxNQUFNLENBQUMsQ0FBQTtTQUNYLENBQUMsQ0FBQTtPQUNIO0tBQ0YsQ0FBQTtHQUNGO0NBQ0YsQ0FBQTs7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsUUFBTSxFQUFFLE1BQU07QUFDZCxVQUFRLEVBQUUsUUFBUTtBQUNsQixVQUFRLEVBQUUsUUFBUTtBQUNsQixRQUFNLEVBQUM7QUFDTCxjQUFVLEVBQUM7QUFDVCxXQUFLLEVBQUU7QUFDTCxZQUFJLEVBQUUsUUFBUTtBQUNkLGVBQU8sRUFBRSxDQUFFLGdCQUFnQixFQUFFLG1CQUFtQixDQUFFO09BQ25EO0tBQ0Y7R0FDRjtDQUNGLENBQUEiLCJmaWxlIjoic3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBEZXNjcmliZSBhIG1vZGVsIGFjY2VwdHMgYSBkZXNjcmlwdGlvbiBvZiBhIG1vZGVsLCBhbmQgYSBmdW5jdGlvbiBib2R5XG4qIHdoaWNoIGlzIGNhbGxlZCB3aXRoIGNlcnRhaW4gZ2xvYmFsIHByb3BlcnRpZXMgYXZhaWxhYmxlIHRvIHVzZSBhcyBhIGNoYWluYWJsZSBEU0xcbiogdGhhdCBjYW4gYmUgdXNlZCB0byBkZXNjcmliZSB0aGUgc3RydWN0dXJlIG9mIGFuIGVudGl0aWVzIHVuZGVybHlpbmcgZG9jdW1lbnRzXG4qIG9yIGRhdGEgc291cmNlc1xuKlxuKiBUaGUgZmlyc3QgYXJndW1lbnQgdG8gdGhlIGZ1bmN0aW9uIGlzIHRoZSBtb2RlbCBkZWZpbml0aW9uIG9iamVjdCBpdHNlbGYuICBUaGlzXG4qIGlzIGEgZmxleGlibGUgc3RydWN0dXJlIHdoaWNoIGxldHMgeW91IGV4cHJlc3MgZmFjdHMgYWJvdXQgZG9jdW1lbnRzIGFuZCBkYXRhc291cmNlc1xuKiB3aGljaCBhcmUgcGFyc2VkIGluIG9yZGVyIHRvIHByb3ZpZGUgYW4gaW5zdGFuY2Ugb2YgdGhpcyBNb2RlbCBBS0EgYW4gRW50aXR5LCB3aXRoIGl0cyBhdHRyaWJ1dGVzXG4qIGFuZCBtZXRob2RzLlxuKi9cblxuZGVzY3JpYmUoXCJTcGVjXCIsIGZ1bmN0aW9uKG1vZGVsKXtcbiAgdmFyIHNwZWMgPSBtb2RlbCwgc3BlY3MgPSBtb2RlbDtcblxuICAvKlxuICBzcGVjcy5oYXZlLmF0dHJpYnV0ZXMoZnVuY3Rpb24oKXtcbiAgICBzdHJpbmcoJ3RpdGxlJylcbiAgICBzdGF0dXMoJ2luX3Byb2dyZXNzJywncGFzc2luZycsJ2ZhaWxpbmcnKVxuICB9KVxuICAqL1xuXG4gIHNwZWMuZG9jdW1lbnRzLmhhdmUuYS5zZWN0aW9uKCdTcGVjaWZpY2F0aW9ucycsIGZ1bmN0aW9uKHNlY3Rpb24pe1xuICAgIHNlY3Rpb24uaGFzLm1hbnkuYXJ0aWNsZXMoJ0V4YW1wbGVzJywgZnVuY3Rpb24oZXhhbXBsZSwgaSl7XG4gICAgICBleGFtcGxlLmJ1aWxkZXIgPSBidWlsZGVycy5leGFtcGxlXG4gICAgfSlcblxuICAgIHNlY3Rpb24uYnVpbGRlciA9IGJ1aWxkZXJzLnNwZWNpZmljYXRpb25zXG4gIH0pXG59KVxuXG5mdW5jdGlvbiBjcmVhdGUoeyBkb2N1bWVudCB9LCBjb250ZXh0ID0ge30pe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgZG9jdW1lbnQuZGF0YSwge1xuICAgIHNwZWNpZmljYXRpb25zOiBkb2N1bWVudC5zcGVjaWZpY2F0aW9uc1xuICB9KVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZShkb2N1bWVudCwgc3BlYywgdXRpbCl7XG4gIHJldHVybiB0cnVlXG59XG5cbnZhciBidWlsZGVycyA9IHtcbiAgc3BlY2lmaWNhdGlvbnM6IGZ1bmN0aW9uKHNlY3Rpb24pe1xuICAgIHZhciBiYXNlID0ge1xuICAgICAgdGl0bGU6IHNlY3Rpb24udmFsdWUsXG4gICAgICBnZXROb2RlOiBmdW5jdGlvbigpeyByZXR1cm4gc2VjdGlvbiB9LFxuICAgICAgcnVuVGVzdHM6IGZ1bmN0aW9uKCl7XG4gICAgICAgIHJldHVybiBzZWN0aW9uLmV4YW1wbGVzLm1hcChmdW5jdGlvbihleGFtcGxlLCBpbmRleCl7XG4gICAgICAgICAgcmV0dXJuIFtleGFtcGxlLnJ1blRlc3RzKCksIGV4YW1wbGVdXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGJhc2UsICdleGFtcGxlcycsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIHNlY3Rpb24uZXhhbXBsZXNcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGJhc2VcbiAgfSxcbiAgZXhhbXBsZTogZnVuY3Rpb24oZXhhbXBsZSwgaW5kZXgpe1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogZXhhbXBsZS52YWx1ZSxcbiAgICAgIGdldE5vZGU6IGZ1bmN0aW9uKCl7IHJldHVybiBleGFtcGxlIH0sXG4gICAgICBpbmRleDogaW5kZXgsXG4gICAgICBjb2RlQmxvY2tzOiAoZXhhbXBsZS5jb2RlQmxvY2tzIHx8IFtdKS5wbHVjaygndmFsdWUnKSxcbiAgICAgIHJ1blRlc3RzOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICAgICAgdmFyIGxvY2FscyA9IHtvcHRpb25zOiBvcHRpb25zLCBkb2N1bWVudDogZXhhbXBsZS5kb2N1bWVudCwgc2VjdGlvbjogZXhhbXBsZS5wYXJlbnQsIGFydGljbGU6IGV4YW1wbGV9XG5cbiAgICAgICAgcmV0dXJuIGV4YW1wbGUuY29kZUJsb2Nrcy5tYXAoZnVuY3Rpb24oY29kZUJsb2NrKXtcbiAgICAgICAgICBsb2NhbHMuY29kZUJsb2NrID0gY29kZUJsb2NrXG5cbiAgICAgICAgICByZXR1cm4gdXRpbC5ydW5XaXRoTG9jYWxzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBldmFsKGNvZGVCbG9jay52YWx1ZSlcbiAgICAgICAgICB9LCBsb2NhbHMpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6IGNyZWF0ZSxcbiAgdmFsaWRhdGU6IHZhbGlkYXRlLFxuICBidWlsZGVyczogYnVpbGRlcnMsXG4gIGNvbmZpZzp7XG4gICAgYXR0cmlidXRlczp7XG4gICAgICB0aXRsZToge1xuICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgc291cmNlczogWyAnbWV0YWRhdGEudGl0bGUnLCAnaGVhZGluZ3MudGl0bGVzLjAnIF1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuIl19