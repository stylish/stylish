# Model Resolver Spec

Generally Skypager Projects follow a convention over configuration philosophy and we can deduce through which folder something is in, or what it is named, what helpers are responsible for that file.

However in the event you wanted to deviate from this, resolvers can be used to help determine things like which Model class should be responsible for turning a Document into an Entity.

## Specifications

### Projects can set a default model class

```
project.models.default.should.have.property.name('Testcase')
```

### Documents can set a type value in their metadata to control which model is used

### The folders directly under the projects documents paths are named like their models 

```
project.resolve.model('docs/examples').should.have.property.name('Example')
```

### Projects can be configured with regular expressions to map to a particular model

```
project.resolve.models.addPattern(/-spec.js$/, 'testcase')
project.resolve.model('whatever-spec.js').should.have.property.name('Testcase')
```
