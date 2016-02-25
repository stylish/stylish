# Portfolio Packages

Packages are for shared components, patterns, utilities, and other assets that are shared among the portfolio projects.


## Types of Packages

There are different kinds of packages, and of course you can develop your own.  They are just simple npm modules with a package manifest.

The Skypager's project portfolio consists of different packages:

- Bootstrap Themes
- React UI Components
- Skypager Plugins
- General NPM Modules
- Third Party API Wrappers

The portfolio gives us one place to manage everything we need on these projects from writing documentation, writing tests, roadmap planning, publishing websites,

### Packages provide values

A Package will declare what we need to know about it by defining data on the `skypager` property of its `package.json` npm module manifest.

```json
{
  "name": "portfolio-ui-kit",
  "version": "1.0.0",
  "skypager": {
    "provides": [
      "components",
      "themes"
    ]
  }
}
```

Packages can be categorized in an unlimited number of ways.  We like to categorize ours based on what kind of component they provide.
