---
type: component
title: Standard WebApp
icon: browser
---

# Web Application Shell

A multi-screen web application that comes preconfigured with Redux, React-Router, and React Bootstrap.  All of your project's copy, content, data sources, and settings made available to your screens via a context property.

This shell promotes a developer experience focused on features and functionality instead of frameworks and tools.  You only need to supply the project with `Screens` in the `src/entries` folder.  No other setup required.

## Getting Started

If you used the `skypager init` command to generate your project, you will have everything you need already wired up for you by default.  You can copy the example screen found in `src/entries`.

## Examples

### Application Entry Point

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

### Screen Entry Point

This is an entry point react component.  

It would exist at `<project>/src/entries/Products`.

Because it is an entry point, and because it exports static `path` and `childRoutes` properties, it will automatically get wrapped in the appropriate configuration for react router.

```js
import React, { Component } from 'react'
import ProductList from 'components/ProductList'

export class Products extends Component {
  
  static path = "products";

  static childRoutes = {
    ':productId': 'Products/Details'
  };

  static contextProps = {
    project: React.propTypes.shape({
      entities: React.propTypes.shape({
        products: React.propTypes.object
      })
    })
  };

  render() {
    const { project } = this.contextt
    const { products } = project.entities
    const copy = project.copy.products

    return (
      <ProductList title={copy.title} products={products} />
    )
  }
}
```

