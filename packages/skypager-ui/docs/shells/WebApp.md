---
type: component
title: WebApp
icon: browser
---

# Web Application Shell

Our `Web Application Shell` intends to provide an application development experience focused on features and functionality overs frameworks and tools, but we are trying to do this without limiting the power and flexibility one expects to have when developing custom software in the promised land of unfettered creativity backed by the perfect framework and tools that "just work".

With this shell, `react.router` and `redux` combine with `react-bootstrap` and `skypager-themes`, `webpack`, `babel`, and a host of other tools to provide your `Skypager Project` with a base line of developer power and best practices, top notch performance and stability, all at the lowest possible cost in terms of complexity and busy work. 

Developing on top of the shell begins at the most logical place, the one most stake holders in the project cares about most.  What powers are you giving your users? Which `Screens` are you going to use to do it? 

## Getting Started


## Examples

### The Application Entry Point

```js
import WebApp from 'ui/shells/WebApp'
import BundleLoader from 'ui/bundle/loader'

const bundle = BundleLoader(
  require('dist/bundle')
)

WebApp.create({
  bundle
})
```

In theory you would never need to change this code.  If you follow the file naming and organization conventions provided by Skypager, then this application will automatically build a fully functional application that leverages the full power of react-router, redux, react and redux-devtools, webpack code splitting, and many other configuration and developer tooling chores that fatigue developers daily.  

We think these are all great tools.  We just believe their actual configuration and implementation should be implied and automatic, and not something somebody needs to do manually.

### Organizing your application files

It is completely possible to build an application with the `WebApp` shell, and provide your own react-router and redux implementations and approaches.  

Skypager encourages you and provides you with a lot of support if you choose to organize your application code around the idea `Entry Points` which we can call `Screens`, `Pages`, `Routes`, or `URLs`.

In doing so, we will minimize a lot of boilerplate code for you.

Take a look at the following example project:

```
- apps/
  - web.js
- components/
  - SearchForm/
    - index.js
    - style.less
  - SearchResults/
    - index.js
  - ProductDetails/
    - index.js
- entries/
  - Products/
    - screens/
      - Browse.js
      - Details.js
    - index.js
    - state.js
- layouts/
  - SingleColumn/
    - index.js
- settings/
  - apps/
    - web/
      - branding.yml
      - integrations.yml
      - navigation.yml
      - screens.yml
  - builds/
    - web.yml
  - servers/
    - web.yml
```

An `Application` consists of many `Screens`.

A `Screen` consists of a `Layout`, `Components` and `State`.


In the example below, the screen is a a single column layout with the form above the table.  A user searches for products, and the table displays the matches.

```js
import React, { Component, PropTypes as t } from 'react'
import stateful from 'ui/util/stateful'

class Products extends React.Component {
  static displayName = 'Products';

  static propTypes = {
    products: t.arrayOf(t.shape({
      title: t.string.isRequired  
    })),

    settings: t.shape({
      branding: t.shape({
        brand: t.string.isRequired,
        icon: t.string.isRequired
      })
    })
  };

  render () {
    const { products, branding, filters } = this.props

    return (
      <SingleColumn brand={brand} icon={icon}>
        <SearchForm filters={filters} onChange={this.updateFilters}/>
        <SearchResults products={products}/>
      </SingleColumn>
    )
  }
}

// Important Part. 'Connects' this component to the redux store, and uses 
// the products, branding, and filters state as component props
export default stateful(
  Products, 
  'products', 'settings.branding', 'products.filters'
)
```

State is your application data and content, and it is modified when the user clicks on buttons and types in forms.  This is all managed through a `redux` store, with actions, and reducers.  

State is also, most importantly in a web app, directly related the current URL.  Normally you would have to wire all of this up using `react-router`, `redux-router`, `history`, `react-redux`, `redux-thunk`, and i'm sure I'm missing a few.

To the largest degree possible, all of this is wired up for you for one very low price: you need to make sure you store your files in the right folders.

### Choosing Screens, Layouts, Themes, etc

In my own professional experience, it is very rare when I am building a Web Application that I am the one who "chooses" or "decides" which screens are in that application.  Instead I facilitate that choice as it is made by others.  

For any individual screen, what data, content, labels, etc. show up on the screen, how this stuff is laid out, and in which type of UI component, are things other professionals are better equipped to decide on.  

The `Application Shell` is conceptually designed to respond to these decisions, very much like a `React.Component` responds to whatever `state` and `props` are passed to it.  It expects these decisions to be passed in as configuration, and not to "live" in the source code itself. 

This, ironically, makes the power of convention over configuration even stronger.

By convention, all of the different entry points to your application will have unique, identifiable names.  You could copy and paste these names directly from an email, and as long as they're on one line, that blob of text can be used to generate a 1000 page website.  

Better yet, you could write a script to read your email, and when the marketing director tells you we need a new site and it has to have these pages, and attached is a spreadsheet with the content you need, you could automate every step.

## Skypager Project Bundle

By design most of the "custom" decisions one needs to make when building an application live outside of the React code, and instead exist in simpler forms that are easier to integrate into the tools and work flows of non-developers.  

These decisions: things like labels, copy, content, branding and identity, color palette, typography, etc are provided to the WebApp shell through the `Skypager Project Bundle`.  


The Project Bundle is a single data file that is automatically generated from the content, assets, and data that lives in many different forms and on other systems.  All of this data is structured in a way that it can very easily power not just a running React and Redux application, but also the build tools we rely on to distribute these applications on the Web and Native platforms. 

## Philosophy

### React's power is the knowledge of what should change, and what shouldn't

Think of an `Application Shell` as a React Component. The state and props for this Component are all of the different decisions, information, content, and values that are given to developers from other professionals, in files and forms that do not typically live in a typical code base.  The Application Shell is designed to support these decisions, especialy as they change, without requiring manual effort by developers to change the code, test it, and redeploy it.

Visual Designers, Copy Writers, User Experience Designers , Information Architects all contribute significant and critical input into the design of a software application or website.  

In order to  empower these professionals and give them the ability to have their decisions take effect in a software system directly and as quickly as possible, we have typically had to choose between the speed and efficiency of off the shelf content management systems and templates, and the power and flexibility of custom code.

