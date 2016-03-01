# Content Collections

A `Skypager.Project` contains many files. They fall in two categories, the one we are writing about here is Project Content. These are the work product files living in the project and depending on which subfolder they live in, they will be assigned to their own `Skypager.Collection`.

All of the Project Content files are backed by `Skypager.Asset` objects, depending on what type of file (by default, determined by what file extension it has)  

Every different type of `Skypager.Asset` is assigned to its own `Skypager.Collection`


## Usage

### Querying to find assets

### Creating a new file in a content collection

```js
// one possible way

let { path, content } = openEditor()

let collection = project.docs

collection.createFile(
  'docs/sections/new-page.md',
  content
)
```
