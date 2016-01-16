Skypager makes it easy to take the parsed data from the project, and bring them alive through the use of Models.  Models are templates which describe an interface for specific types of Entities that are referenced in the project.  

## Specifications 

### Skypager ships with some entities

Skypager ships with a couple of entities.

```javascript
project.models.available.should.containEql('Outline','Page')
```

#### Outlines

An Outline can a simple Table of Contents.  

Outlines once parsed, are a great way to start a project and then automatically generate the appropriate documents in the proper place based on the headings. 

```javascript
var outlineModel = project.models.lookup('Outline')

outlineModel.attributeNames.should.containEql('title','sections','subsections')
```

#### Pages

Pages are just simple documents with titles.

```javascript
var pageModel = project.models.lookup('Page')

pageModel.attributeNames.should.containEql('title')
```

### Entity types can be inferred from the folder they belong to

### Entity types can be specified by the file metadata

### Entity types can be forced at a project level

### Entity types can be determined on an asset by asset basis as well
