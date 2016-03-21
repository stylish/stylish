# Skypager

This is the portfolio project for Skypager.  A Portfolio is a parent repository which contains multiple sub projects, some of which which support or depend on one another.  All of the projects will share dependencies and tooling by virtue of the project's folder structure.

**Note:** This project is very alpha.

## Skypager Projects

Skypager Projects are npm modules which contain source code and other assets. They must have a `skypager` key in their package.json.  The contents of these projects are parsed and indexed based on configuration rules, and can be bundled up and exported as websites, mobile applications, desktop applications, or whatever else you can imagine.  

Each project consists of Asset collections and Helper registries.  

#### Asset Collections

Asset Collections are different types of source files which get parsed into an AST format using popular AST libraries:

- remark for markdown
- postCSS for CSS, Less, Sass etc
- babel for javascript
- cheerio for XML and other DOMs

They provide a queryable data store for your application to be able to work with your application's code in a way that is not restricted by what exists in the file.

```js
// load the project from current directory 
let project = require('skypager-project').load()
let docs = project.content.docs
let scripts = project.content.scripts

// find all of the test files
scripts.where({filename: /-spec/})

// find all of the react components
let components = scripts.where({category: 'components'})

// use the react-docgen parser on them
let componentData = 

components
  .map(c => c.parser = require('react-docgen').parse && c)
  .filter(c => c.parsed)

// save that as a new data source
let dataSource = project.data.createAsset('component/docs.yml')
dataSource.set(componentData)
dataSource.save()
```

The example above is close to a real world example and is
certainly possible.  What we did was work with the react
component javascript files as if they were records in a
database.  

This allows us to do programmatic manipulation of
project code based on their AST forms.

We can work with the ASTs of Javascript, Markdown, CSS, SVG,
HTML, and more. 

```javascript

// find all of the documents in draft status
docs.query({status:'draft'})

// combine all of the documents about italy into one HTML
let italy = docs.query((d) => d.data.tags.indexOf('Italy') >= 0)

let html = `
<html>
  <body>
    ${ italy.map(doc => doc.html) } 
  </body>
</html>
`
```


#### Helper Registries

Helpers are functions which do various things on your behalf.

- **Actions** are functions which provide an interface to
  the outside world to make small, well defined requests to
  **do something to or with** the project.  Whether it is
  generating new assets, or converting existing assets like
  SVGs to React Components, or downloading a spreadsheet and
  converting it to JSON, actions are reusable chunks of
  functionality which can be used to accomplish the task.
  Actions can be exposed via a CLI, Web Server, Websocket,
  or IPC.

- **Importers** and **Exporters** are functions which pull
  assets into the project, or export project assets into
  other forms.  There are a variety of these helpers provided by
  the framework and new ones can be found in plugins. 

- **Models** are functions which extract structured data and
  attributes about the **things** that exist in the project,
  or that relate to the project.

- **Renderers** are functions which take the project's
  assets in AST form and combine them in whatever way is
  desired.

#### Registries

Helpers are accessible via the Registry system.  The
`Skypager` framework itself has a registry, as does every
project.  The Skypager framework registry is a fallback for
when a helper is requested by the project and does not exist
locally.

```js
let project = require('skypager-project').load()

// run the dropbox sync action
project.run.action('dropbox/sync')

// view the required parameters for an action
project.actions.lookup('dropbox/sync').definition.parameters

// query the available actions to see which have a CLI
project.actions.query(a => a.get('definition.interfaces.cli'))

// export the project as an asar archive
project.run.exporter('packager/asar')

```


## Getting Started

```
git clone git@github.com:architects/skypager-central.git
cd skypager-central
npm install
```

Once this project is cloned and the dependencies are installed, you should be able to run `npm run test` and see that the entire test suite runs for each package in the portfolio.

## Skypager CLI

The `skypager` cli should be installed globally automatically when you run npm install inside this project.

You can run `skypager --help` to see the available options.

Here are the important commands:

- `skypager init` will create a new skypager project based on the package found in `packages/skypager-template-project`
- `skypager dev` will start a webpack development server.
- `skypager build` will run a production webpack build.
- `skypager author` will open up skypager-electron

## Webpack & React Devserver

You can checkout `packages/skypager-template-project` to see
what the default skypager project will look like.

```
cd packages/skypager-template-project
skypager dev
```

The dev server will be running on http://localhost:3000

## Skypager UI Docs

The `skypager-ui` package contains shared UI components,
Page Layouts, and Application Shells.  You can view the docs
project by:

```
cd packages/skypager-ui
skypager dev web
```

It will be running on localhost at the configured port (3000
by default)

