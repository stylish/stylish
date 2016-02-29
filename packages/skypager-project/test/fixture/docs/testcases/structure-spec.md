---
example: metadata
---

This is a paragraph. I wanna see what happens when the first item isn't a title heading.

- list item one
- list item two

# Document Structuring

Skypager allows you to provide special meaning to the content of a
document by including it under document headings.  Heading hierarchies
can be used by An Entity Model to build object trees, for example the
document you are reading now has an `h2` specifications section that is
a required section for.

[link:docs/assets/data-source-spec](Link Body Text)

## Setup

To test the structuring of a document we will use this document as an example.

```javascript
var document = project.documents.at('testcases/structure-spec')
```

## Specifications

### Documents treat h2 as section headings 

```javascript
var sections = document.headings.sections

sections.should.containEql('Setup','Specifications')
sections.should.not.containEql('Article Heading B')
```

### Documents treat h3 as article headings 

```javascript
var articles = document.headings.articles

articles.should.not.containEql('Setup','Specifications')
articles.should.containEql('Article Heading B')
```

### Sections can be mapped back to their markdown line numbers

```javascript
document.sections.setup.beginsAt.should.have.property('line', 14)
document.sections.setup.lines.should.have.property('length', 9)
```

### Sections reference their parent sections

#### For Example

```javascript
document.nodes.at('for-example').parent.should.have.property('lineNumber', 44)
```

### Documents provide an easy way of accessing their sections

## Usage 

How you use this feature is up to you.
