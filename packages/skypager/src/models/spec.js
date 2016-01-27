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

describe("Spec", function(model){
  var spec = model, specs = model;

  /*
  specs.have.attributes(function(){
    string('title')
    status('in_progress','passing','failing')
  })
  */

  spec.documents.have.a.section('Specifications', function(section){
    section.has.many.articles('Examples', function(example, i){
      example.builder = builders.example
    })

    section.builder = builders.specifications
  })
})

function create({ document }, context = {}){
  return Object.assign({}, document.data, {
    specifications: document.specifications
  })
}

function validate(document, spec, util){
  return true
}

var builders = {
  specifications: function(section){
    var base = {
      title: section.value,
      getNode: function(){ return section },
      runTests: function(){
        return section.examples.map(function(example, index){
          return [example.runTests(), example]
        })
      }
    }

    Object.defineProperty(base, 'examples', {
      configurable: true,
      get: function(){
        return section.examples
      }
    })

    return base
  },
  example: function(example, index){
    return {
      title: example.value,
      getNode: function(){ return example },
      index: index,
      codeBlocks: (example.codeBlocks || []).pluck('value'),
      runTests: function(options){
        var locals = {options: options, document: example.document, section: example.parent, article: example}

        return example.codeBlocks.map(function(codeBlock){
          locals.codeBlock = codeBlock

          return util.runWithLocals(function(){
            eval(codeBlock.value)
          }, locals)
        })
      }
    }
  }
}

module.exports = {
  create: create,
  validate: validate,
  builders: builders,
  config:{
    attributes:{
      title: {
        type: 'string',
        sources: [ 'metadata.title', 'headings.titles.0' ]
      }
    }
  }
}

